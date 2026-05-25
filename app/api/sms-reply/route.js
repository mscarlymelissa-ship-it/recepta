import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const supabase = createClient(
    'https://osiouwgiaoldctuvahxb.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  )

  const formData = await request.formData()
  const fromNumber = formData.get('From')
  const toNumber = formData.get('To')
  const body = formData.get('Body')

  // Find the most recent lead from this number
  const { data: lead } = await supabase
    .from('Leads')
    .select('*, contractors(*)')
    .eq('phone', fromNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (lead) {
    // Update lead with their reply
    await supabase.from('Leads').update({
      message: body,
      status: 'replied'
    }).eq('id', lead.id)

    // Notify contractor of the reply
    if (lead.contractors?.notification_phone) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )

      await client.messages.create({
        body: `💬 ${fromNumber} replied: "${body}" — log in to follow up: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: lead.contractors.notification_phone
      })
    }
  }

  return new Response('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' }
  })
}