import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const supabase = createClient(
    'https://osiouwgiaoldctuvahxb.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  )

  const { id, name, description, address, urgency } = await request.json()

  const { error } = await supabase.from('Leads').update({
    name: name,
    message: description,
    address: address,
    urgency: urgency,
    status: 'replied'
  }).eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}