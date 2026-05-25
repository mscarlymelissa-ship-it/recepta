import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const supabase = createClient(
    'https://osiouwgiaoldctuvahxb.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  )

  const formData = await request.formData()
  const callerNumber = formData.get('From')
  const calledNumber = formData.get('To')

  // Find contractor by their Twilio number
  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('twilio_number', calledNumber)
    .single()

  // Save lead to Supabase
  const { data: lead } = await supabase.from('Leads').insert([{
    phone: callerNumber,
    message: 'Missed call - awaiting response',
    status: 'waiting',
    contractor_id: contractor?.id || null
  }]).select().single()

  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/job/${lead?.id}`

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  // Send auto-reply SMS to caller with form link
  const smsMessage = (contractor?.sms_message ||
    "Hi! Sorry we missed your call. We're currently on a job.") +
    ` Tell us what you need here: ${formUrl}`

  await client.messages.create({
    body: smsMessage,
    from: calledNumber || process.env.TWILIO_PHONE_NUMBER,
    to: callerNumber
  })

  // Notify contractor
  if (contractor?.notification_phone) {
    await client.messages.create({
      body: `📞 New missed call from ${callerNumber}. Log in to Recepta to follow up: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contractor.notification_phone
    })
  }

  return new Response('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' }
  })
}