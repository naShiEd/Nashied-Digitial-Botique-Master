import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../CMSContext';
import '../App.css';

export default function Hosting() {
  const { content } = useCMS();
  const page = content.pages.hosting;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: '40px' }}>
        <div className="page-hero-bg" style={{ 
          backgroundImage: `linear-gradient(rgba(3,16,66,0.7), rgba(3,16,66,0.7)), url("${page.hero.bg}")`,
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

      {/* Hosting Details */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <ScrollReveal>
          <div className="who-we-are-inner" style={{ alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '32px', color: 'var(--white)', marginBottom: '24px' }}>{page.storyTitle}</h2>
                <p style={{ color: 'var(--gray)', fontSize: '18px', lineHeight: 1.6, marginBottom: '24px' }}>
                  {page.storyDesc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {['Business Email', 'Managed Cloud', 'Domain Support', 'Cyber Security'].map(p => (
                     <div key={p} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', color: 'var(--white)', fontWeight: 600 }}>
                       ✦ {p}
                     </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--navy-mid)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                 <h3 style={{ fontSize: '24px', color: 'var(--white)', marginBottom: '16px' }}>Ready to deploy?</h3>
                 <p style={{ color: 'var(--gray)', marginBottom: '32px' }}>Let Nashied handle your digital foundation so you can focus on building your brand.</p>
                 <a href="/contact" className="btn-primary">Get Started →</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ padding: '80px 0', background: 'var(--navy-mid)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal>
             <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: 'var(--white)', fontWeight: 700, marginBottom: '60px' }}>ENTERPRISE INFRASTRUCTURE</h2>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--teal)', fontSize: '20px', marginBottom: '12px' }}>99.9% Uptime</h4>
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Enterprise-grade reliability for your websites and mission-critical software.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--teal)', fontSize: '20px', marginBottom: '12px' }}>Cloud Security</h4>
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Advanced threat protection and secure storage planning for total digital continuity.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--teal)', fontSize: '20px', marginBottom: '12px' }}>Managed Support</h4>
                  <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Our technical team handles deployment and server maintenance 24/7.</p>
                </div>
             </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
