import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  const formData = await request.formData()
  const callerNumber = formData.get('From')

  // Save lead to Supabase
  await supabase.from('Leads').insert([{
    phone: callerNumber,
    message: 'Missed call - awaiting response',
    status: 'waiting'
  }])

  // Send SMS back to caller
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    body: "Hi! Sorry we missed your call. We're currently on a job. Reply with a brief description of what you need and we'll get back to you shortly.",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: callerNumber
  })

  // Return TwiML response
  return new Response('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' }
  })
}