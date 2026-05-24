import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://osiouwgiaoldctuvahxb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaW91d2dpYW9sZGN0dXZhaHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODg0MzcsImV4cCI6MjA5NTE2NDQzN30.1bObsaR3cLglWVp1NiBffoW2rfp3Gqy8_AgXcYSLEPg'
)