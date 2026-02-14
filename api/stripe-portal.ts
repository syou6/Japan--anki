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
  const { userId, returnUrl } = req.body ?? {};

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl || req.headers.origin || 'https://japan-anki.vercel.app',
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session error:', error.message);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}
