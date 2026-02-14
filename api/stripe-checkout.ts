import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabaseAdmin } from './_lib/supabase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured' });
  }

  const stripe = new Stripe(stripeSecretKey);

  const { priceId, userId, successUrl, cancelUrl } = req.body ?? {};

  if (!priceId || !userId) {
    return res.status(400).json({ error: 'Missing priceId or userId' });
  }

  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(404).json({ error: 'User not found' });
    }

    let customerId = userData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { supabase_user_id: userId },
      });

      customerId = customer.id;

      await supabaseAdmin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/subscription/success`,
      cancel_url: cancelUrl || `${req.headers.origin}/subscription/cancel`,
      subscription_data: {
        trial_period_days: 30,
        metadata: { supabase_user_id: userId },
      },
      metadata: { supabase_user_id: userId },
      allow_promotion_codes: true,
      locale: 'ja',
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
