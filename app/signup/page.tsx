'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from('contractors').insert([{
        id: data.user.id,
        business_name: businessName,
        notification_phone: phone,
      }])
      try {
        await fetch('/api/provision-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            areaCode: phone.replace(/\D/g, '').slice(1, 4)
          })
        })
      } catch (e) {
        console.log('Provisioning failed, continuing anyway')
      }
      router.push('/dashboard')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>Recepta</div>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#111', marginBottom: '0.5rem' }}>Get started</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem' }}>Create your Recepta account</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '0.75rem', fontSize: '13px', color: '#dc2626', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Business name</label>
          <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Mike's Plumbing" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Your mobile number</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (604) 555-0100" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '13px' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button onClick={handleSignup} disabled={loading} style={{ width: '100%', padding: '11px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '1.5rem' }}>
          Already have an account? <a href="/login" style={{ color: '#1D9E75', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </main>
  )
}