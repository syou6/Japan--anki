import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabaseAdmin } from './_lib/supabase-admin';

// Vercel needs raw body for Stripe signature verification
export const config = {
  api: { bodyParser: false },
};

function buffer(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return res.status(500).json({ error: 'Missing Stripe configuration' });
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody.toString(), signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        await supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          plan_type: session.metadata?.plan_type || 'premium',
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;
        const familyPriceId = process.env.STRIPE_FAMILY_PRICE_ID;

        let planType = 'premium';
        if (priceId === familyPriceId) {
          planType = 'family';
        } else if (priceId === premiumPriceId) {
          planType = 'premium';
        }

        // Find user_id from customer metadata or existing record
        const { data: existingSub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single();

        if (existingSub) {
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: existingSub.user_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            plan_type: planType,
            stripe_price_id: priceId,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', invoice.customer as string)
          .single();

        if (user) {
          await supabaseAdmin.from('payment_history').insert({
            user_id: user.id,
            stripe_invoice_id: invoice.id,
            stripe_payment_intent_id: (invoice as any).payment_intent as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            description: `Payment for ${invoice.lines.data[0]?.description || 'Subscription'}`,
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', (invoice as any).subscription as string);
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
