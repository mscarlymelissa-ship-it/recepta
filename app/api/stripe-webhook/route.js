import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const supabase = createClient(
    'https://osiouwgiaoldctuvahxb.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  )

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId

    await supabase.from('contractors').update({
      plan: 'starter',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
    }).eq('id', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object

    await supabase.from('contractors')
      .update({ plan: 'free' })
      .eq('stripe_subscription_id', subscription.id)
  }

  return new Response('OK', { status: 200 })
}