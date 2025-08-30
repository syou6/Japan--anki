#!/bin/bash

# Create Stripe webhook endpoint
curl https://api.stripe.com/v1/webhook_endpoints \
  -u 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: \
  -d url="https://dtcskayvcsrgjausqkni.supabase.co/functions/v1/stripe-webhook" \
  -d "enabled_events[0]=checkout.session.completed" \
  -d "enabled_events[1]=customer.subscription.created" \
  -d "enabled_events[2]=customer.subscription.updated" \
  -d "enabled_events[3]=customer.subscription.deleted" \
  -d "enabled_events[4]=invoice.payment_succeeded" \
  -d "enabled_events[5]=invoice.payment_failed"