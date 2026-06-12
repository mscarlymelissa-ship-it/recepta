'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  async function handleSubscribe() {
    setLoading(true)
    if (!user) {
      router.push('/signup')
      return
    }
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email })
    })
    const { url, error } = await response.json()
    if (error) {
      console.error(error)
      setLoading(false)
      return
    }
    window.location.href = url
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>Recepta</div>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '500', color: '#111', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Simple pricing</h1>
        <p style={{ fontSize: '15px', color: '#888', textAlign: 'center', marginBottom: '2rem' }}>One plan. Everything included. Cancel anytime.</p>

        <div style={{ background: '#fff', border: '2px solid #1D9E75', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '48px', fontWeight: '500', color: '#111', letterSpacing: '-2px' }}>$49</span>
            <span style={{ fontSize: '16px', color: '#888' }}>/month</span>
          </div>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem' }}>Everything you need to stop losing jobs</p>

          <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
            {[
              'Local phone number in your area code',
              'Instant auto-reply SMS to missed calls',
              'Lead capture form with job details',
              'Real-time lead dashboard',
              'Instant SMS notification to your phone',
              'Custom auto-reply message',
              '14-d