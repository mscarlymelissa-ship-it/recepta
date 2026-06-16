import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const hasSession = cookieStore.get('sb-access-token') || cookieStore.get('sb-refresh-token')
  
  if (hasSession) {
    redirect('/dashboard')
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', color: '#111' }}>
      
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: '#1D9E75', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '500' }}>Recepta</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/login" style={{ fontSize: '14px', color: '#888', textDecoration: 'none', padding: '8px 16px' }}>Sign in</a>
          <a href="/signup" style={{ fontSize: '14px', background: '#111', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '500' }}>Get started</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 4rem', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E1F5EE', color: '#085041', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          Built for tradespeople
        </div>
        <h1 style={{ fontSize: '44px', fontWeight: '500', lineHeight: '1.15', letterSpacing: '-1.5px', color: '#111', marginBottom: '1.25rem' }}>
          Every missed call<br />is a <span style={{ color: '#1D9E75' }}>job you lost.</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#666', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Recepta automatically texts back anyone who calls when you can't pick up. Captures their job details and adds them to your lead dashboard.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
          <a href="/signup" style={{ background: '#1D9E75', color: '#fff', textDecoration: 'none', padding: '13px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '500' }}>Get started today</a>
          <a href="/pricing" style={{ background: 'transparent', color: '#111', textDecoration: 'none', padding: '13px 24px', borderRadius: '10px', fontSize: '15px', border: '0.5px solid #e5e5e5' }}>See pricing</a>
        </div>
        <p style={{ fontSize: '13px', color: '#aaa' }}>Cancel anytime. First job recovered pays for itself.</p>
      </section>

      {/* Hero image */}
      <div style={{ margin: '0 auto', maxWidth: '780px', padding: '0 2rem' }}>
        <img
          src="/hero.webp"
          alt="Tradesperson on the job"
          style={{ width: '100%', borderRadius: '16px', display: 'block' }}
        />
      </div>

      {/* Dashboard mockup */}
      <div style={{ background: '#f5f5f3', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '1.5rem', margin: '3rem auto', maxWidth: '640px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e5e5e5' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' }}>
          {[
            { label: 'Missed calls', value: '8' },
            { label: 'SMS sent', value: '8' },
            { label: 'Leads captured', value: '6', green: true },
          ].map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>{m.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '500', color: m.green ? '#0F6E56' : '#111' }}>{m.value}</div>
            </div>
          ))}
        </div>
        {[
          { name: 'Dave Miller', phone: '(604) 555-2341', msg: 'Burst pipe under kitchen sink', urgency: '🚨 Emergency', status: 'Waiting', statusColor: '#FAEEDA', statusText: '#633806' },
          { name: 'Sarah Chen', phone: '(778) 555-8820', msg: 'AC not cooling, need someone this week', urgency: '📅 This week', status: 'Replied', statusColor: '#E1F5EE', statusText: '#085041' },
          { name: 'Tom Hughes', phone: '(236) 555-4401', msg: 'Quote on panel upgrade', urgency: '💬 Quote only', status: 'Booked', statusColor: '#E6F1FB', statusText: '#0C447C' },
        ].map((lead, i) => (
          <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '10px', padding: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>{lead.name} — {lead.phone}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{lead.msg}</div>
              <span style={{ fontSize: '10px', background: '#f5f5f3', color: '#888', padding: '2px 8px', borderRadius: '20px', marginTop: '4px', display: 'inline-block' }}>{lead.urgency}</span>
            </div>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: lead.statusColor, color: lead.statusText, fontWeight: '500', flexShrink: 0 }}>{lead.status}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section style={{ padding: '4rem 2rem', maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '500', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Set up in 5 minutes</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '15px', marginBottom: '3rem' }}>No technical knowledge required. No app to download.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { num: '1', title: 'Sign up and get your number', desc: 'Recepta gives you a local phone number in your area code instantly.' },
            { num: '2', title: 'Forward your calls', desc: 'Set up call forwarding on your phone in 2 minutes. We show you exactly how.' },
            { num: '3', title: 'Never lose a lead again', desc: 'Every missed call gets an instant text back. Leads land in your dashboard automatically.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E1F5EE', color: '#085041', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{s.num}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>{s.title}</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI */}
      <section style={{ background: '#f5f5f3', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>The math is simple</h2>
          <p style={{ color: '#888', fontSize: '15px', marginBottom: '2.5rem' }}>The average tradesperson misses 3-5 calls a day. At $400 per job, that adds up fast.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1rem' }}>
            {[
              { value: '$400', label: 'Average job value' },
              { value: '15', label: 'Missed calls per week' },
              { value: '$2,400', label: 'Recovered per month' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '26px', fontWeight: '500', color: '#1D9E75', letterSpacing: '-1px' }}>{m.value}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: '#aaa' }}>Recepta pays for itself with a single recovered job.</p>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '4rem 2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Simple pricing</h2>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '2rem' }}>One plan. Everything included.</p>
        <div style={{ background: '#fff', border: '2px solid #1D9E75', borderRadius: '16px', padding: '2rem' }}>
          <div style={{ fontSize: '48px', fontWeight: '500', color: '#111', letterSpacing: '-2px', marginBottom: '0.25rem' }}>$49<span style={{ fontSize: '18px', color: '#888', fontWeight: '400' }}>/month</span></div>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem' }}>Everything you need to stop losing jobs</p>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '1.5rem', padding: 0 }}>
            {[
              'Local phone number in your area code',
              'Instant auto-reply SMS to missed calls',
              'Lead capture form with job details',
              'Real-time lead dashboard',
              'Instant SMS notification to your phone',
              'Custom auto-reply message',
              'Cancel anytime',
            ].map((f, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#555', padding: '7px 0', borderBottom: i < 6 ? '0.5px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#1D9E75' }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <a href="/signup" style={{ display: 'block', padding: '13px', background: '#1D9E75', color: '#fff', textDecoration: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', marginBottom: '0.75rem' }}>Get started today</a>
          <p style={{ fontSize: '12px', color: '#aaa' }}>Cancel anytime. First job recovered pays for itself.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '0.5px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <div style={{ width: '24px', height: '24px', background: '#1D9E75', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#111' }}>Recepta</span>
        </div>
        <p style={{ fontSize: '13px', color: '#aaa' }}>Never lose a job to a missed call again.</p>
        <p style={{ fontSize: '13px', color: '#aaa', marginTop: '0.5rem' }}>Questions? Email us at <a href="mailto:hello@getrecepta.co" style={{ color: '#1D9E75', textDecoration: 'none' }}>hello@getrecepta.co</a></p>
      </footer>

    </main>
  )
}