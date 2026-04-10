import { useParams, Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../CMSContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import '../App.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const { content } = useCMS();
  const service = content.collections.services.find(s => s.id === id);

  if (!service) {
    return (
      <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--white)' }}>Service not found</h1>
        <Link to="/" className="btn-primary" style={{ marginTop: '24px' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="page-hero" style={{ paddingBottom: '40px' }}>
        <div className="page-hero-bg" style={{ 
          backgroundImage: `linear-gradient(rgba(3,16,66,0.8), rgba(3,16,66,0.8)), url("${service.img}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal>
            <Link to="/" className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', textTransform: 'none', cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back to Services
            </Link>
            <h1 className="page-hero-title">{service.title}</h1>
            <p className="page-hero-desc" style={{ maxWidth: '700px' }}>
              {service.desc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Deep Dive */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="who-we-are-inner" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '80px' }}>
            <ScrollReveal>
              <h2 style={{ fontSize: '36px', color: 'var(--white)', marginBottom: '32px' }}>Why choose Nashied for {service.title}?</h2>
              <p style={{ color: 'var(--gray)', fontSize: '18px', lineHeight: 1.8, marginBottom: '40px' }}>
                We don't just provide a service; we provide a strategic partnership. Our approach to {service.title.toLowerCase()} is built on a foundation of reliability, innovation, and actual business growth. Whether you are a startup looking to make your mark or an established enterprise optimizing your operations, we provide the technical and creative support necessary to succeed.
              </p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  'Bespoke strategic planning tailored to your specific goals.',
                  'High-end execution using the latest industry technologies.',
                  'Integrated analytics and performance tracking.',
                  'Dedicated support and continuous optimization.'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--white)' }}>
                    <CheckCircle size={20} color="var(--teal)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '16px' }}>{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div style={{ background: 'var(--navy-mid)', padding: '48px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: '120px' }}>
                <h3 style={{ fontSize: '24px', color: 'var(--white)', marginBottom: '16px' }}>Interested in this service?</h3>
                <p style={{ color: 'var(--gray)', marginBottom: '32px', lineHeight: 1.6 }}>
                  Let's discuss how we can apply our {service.title.toLowerCase()} expertise to your business challenges.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link to="/contact" className="btn-primary" style={{ justifyContent: 'center' }}>Book a Consultation</Link>
                  <a href={`https://wa.me/${content.global.contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ justifyContent: 'center' }}>Chat on WhatsApp</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
