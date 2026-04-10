import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../CMSContext';
import { CheckCircle, ShieldCheck, Globe, Mail } from 'lucide-react';
import '../App.css';

export default function Hosting() {
  const { content } = useCMS();
  const page = content.pages.hosting;
  const { global } = content;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: '40px' }}>
        <div className="page-hero-bg" style={{ 
          backgroundImage: `linear-gradient(rgba(3,16,66,0.8), rgba(3,16,66,0.8)), url("${page.hero.bg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-tag page-hero-tag">{page.hero.tag}</span>
            <h1 className="page-hero-title">{page.hero.title}</h1>
            <p className="page-hero-desc">
              {page.hero.desc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Plans */}
      <section style={{ padding: '100px 0', background: 'var(--white)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <span className="section-tag" style={{ color: 'var(--navy)' }}>Managed Hosting Plans</span>
              <h2 style={{ fontSize: '48px', color: 'var(--navy)', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>Choose Your Tier</h2>
              <div style={{ background: '#FFF1DA', padding: '12px 24px', borderRadius: '40px', display: 'inline-block', border: '1px solid #FF7A00', color: '#FF7A00', fontWeight: 700 }}>
                🚀 {page.promo}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {page.plans.map((plan: any, i: number) => (
                <div key={i} className="pricing-card" style={{ 
                  background: i === 1 ? 'var(--navy)' : '#ffffff', 
                  padding: '48px', 
                  borderRadius: '32px', 
                  border: i === 1 ? '2px solid var(--teal)' : '1px solid #E6E6E6',
                  boxShadow: '0 20px 48px rgba(0,0,0,0.06)',
                  position: 'relative',
                  transition: 'transform 0.3s ease'
                }}>
                  {i === 1 && <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--teal)', color: 'var(--white)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>POPULAR</div>}
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: i === 1 ? 'var(--white)' : 'var(--navy)', marginBottom: '12px', letterSpacing: '0.05em' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                    <span style={{ fontSize: '42px', fontWeight: 800, color: i === 1 ? 'var(--white)' : 'var(--navy)' }}>${plan.price}</span>
                    <span style={{ fontSize: '16px', color: i === 1 ? 'rgba(255,255,255,0.6)' : 'var(--gray)' }}>{plan.period}</span>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
                    {plan.features.map((feat: string, j: number) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'start', gap: '12px', color: i === 1 ? 'rgba(255,255,255,0.8)' : 'var(--navy)', opacity: 0.9 }}>
                        <CheckCircle size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '15px' }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <a href={`/contact?plan=${plan.name}`} className={i === 1 ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'center', borderColor: i === 0 || i === 2 ? 'var(--navy)' : '', color: i === 0 || i === 2 ? 'var(--navy)' : '' }}>
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Infrastructure Details */}
      <section style={{ padding: '100px 0', background: 'var(--navy-mid)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="who-we-are-inner" style={{ gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '36px', color: 'var(--white)', marginBottom: '24px', letterSpacing: '-0.02em' }}>{page.storyTitle}</h2>
                <p style={{ color: 'var(--gray)', fontSize: '18px', lineHeight: 1.8, marginBottom: '40px' }}>
                  {page.storyDesc}
                </p>
                
                <div style={{ display: 'grid', gap: '24px' }}>
                   <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,122,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         <Mail color="var(--teal)" size={24} />
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--white)', fontSize: '18px', marginBottom: '4px' }}>Business Email</h4>
                        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Professional @yourcompany addresses with Webmail, POP & IMAP access.</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,122,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         <ShieldCheck color="var(--teal)" size={24} />
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--white)', fontSize: '18px', marginBottom: '4px' }}>Total Security</h4>
                        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Malware scanning, quarantine, and free SSL certificates included on higher tiers.</p>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,122,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         <Globe color="var(--teal)" size={24} />
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--white)', fontSize: '18px', marginBottom: '4px' }}>Uptime Guarantee</h4>
                        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>99.9% network availability ensures your business stays live 24/7/365.</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <div style={{ background: 'var(--navy)', padding: '60px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                 <h3 style={{ fontSize: '28px', color: 'var(--white)', marginBottom: '16px' }}>Ready to Scale?</h3>
                 <p style={{ color: 'var(--gray)', marginBottom: '40px', fontSize: '16px', lineHeight: 1.6 }}>
                   Deploy your website or enterprise system on Zimbabwe's most reliable managed infrastructure.
                 </p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Direct Support</div>
                       <div style={{ color: 'var(--white)', fontSize: '20px', fontWeight: 700 }}>{global.contact.phone}</div>
                       <div style={{ color: 'var(--gray)', fontSize: '14px', marginTop: '4px' }}>{global.contact.supportEmail}</div>
                    </div>
                    <a href="/contact" className="btn-primary" style={{ padding: '20px' }}>Request Installation →</a>
                 </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
