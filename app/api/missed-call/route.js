import twilio from 'twilio'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  const formData = await request.formData()
  const callerNumber = formData.get('From')

  await supabase.from('Leads').insert([{
    phone: callerNumber,
    message: 'Missed call - awaiting response',
    status: 'waiting'
  }])

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    body: "Hi! Sorry we missed your call. We're currently on a job. Reply with a brief description of what you need and we'll get back to you shortly.",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: callerNumber
  })

  return new Response('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' }
  })
}