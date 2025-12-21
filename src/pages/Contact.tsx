import { useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Send,
  MessageCircle,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast({
      title: "Transmission Received",
      description: "Your inquiry has been logged in our secure command center.",
    });
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-orange-500/30 selection:text-orange-500">
      <Navigation />

      <section className="pt-48 pb-32 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20">

            {/* 1️⃣ CONTACT INFO */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Systems Online</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                  Connect <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Network</span>
                </h1>
                <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-md">
                  Initiate a consultation with our agency lead. We respond to all mission-critical inquiries within 4-6 business hours.
                </p>
              </div>

              <div className="space-y-10 group">
                <ContactItem
                  icon={Mail}
                  label="Direct Transmission"
                  value="info@nashieddigital.co.zw"
                  href="mailto:info@nashieddigital.co.zw"
                />
                <ContactItem
                  icon={Phone}
                  label="Voice Communication"
                  value="+263 785 394 667"
                  href="tel:+263785394667"
                />
                <ContactItem
                  icon={MapPin}
                  label="Nexus Point"
                  value="1 Ward Road, Braeside, Harare"
                  href="#"
                />
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Broadcasting Channels</p>
                <div className="flex gap-6">
                  <SocialIcon icon={Facebook} href="https://www.facebook.com/naShiEdDigitalBotique" />
                  <SocialIcon icon={Linkedin} href="https://www.linkedin.com/company/106106936/" />
                  <SocialIcon icon={Twitter} href="https://x.com/NashiedDigital" />
                  <SocialIcon icon={Instagram} href="https://www.instagram.com/nashied_digital/" />
                </div>
              </div>
            </div>

            {/* 2️⃣ INQUIRY FORM */}
            <div className="lg:col-span-7">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[48px] backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden group">
                  {/* Glass Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all pointer-events-none" />

                  <h3 className="text-3xl font-black uppercase tracking-tighter">Inquiry Protocol</h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Identity / Full Name</Label>
                      <Input required placeholder="Master Chief" className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold focus:ring-orange-500/50" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Communication Endpoint (Email)</Label>
                      <Input required type="email" placeholder="chief@unsc.mil" className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold focus:ring-orange-500/50" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Mission Objective / Description</Label>
                    <Textarea required placeholder="Describe your project architecture or branding requirements..." className="min-h-[180px] rounded-2xl bg-white/5 border-white/10 text-lg font-bold p-6 focus:ring-orange-500/50" />
                  </div>

                  <Button disabled={loading} className="w-full h-20 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-sm tracking-widest shadow-2xl shadow-orange-500/20 transition-all active:scale-95">
                    {loading ? "Transmitting..." : "Execute Transmission"} <Send className="ml-3 h-5 w-5" />
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <ShieldCheck className="h-4 w-4" /> Secure TLS Encryption Enabled
                  </div>
                </form>
              ) : (
                <div className="bg-white/5 border border-white/10 p-20 rounded-[48px] backdrop-blur-xl text-center space-y-10 animate-fade-in shadow-2xl">
                  <div className="h-24 w-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Transmission Successful</h3>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-sm mx-auto">
                      Our strategic leads have been notified. Stand by for initial contact.
                    </p>
                  </div>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-white/10 h-10 px-8">Send Another Signal</Button>
                </div>
              )}

              {/* WhatsApp Widget Accessory */}
              <div className="mt-12 flex items-center justify-between p-8 bg-green-500/10 border border-green-500/20 rounded-[32px] group hover:bg-green-500/20 transition-all cursor-pointer shadow-lg shadow-green-500/5">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Rapid Response Channel</p>
                    <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">WhatsApp Direct</h4>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-green-500 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20" />
    </div>
  );
};

const ContactItem = ({ icon: Icon, label, value, href }: any) => (
  <a href={href} className="flex items-start gap-6 group/item">
    <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover/item:bg-orange-500 group-hover/item:border-orange-500 transition-all">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/item:text-orange-500 transition-colors">{label}</p>
      <p className="text-2xl font-black uppercase tracking-tight text-white">{value}</p>
    </div>
  </a>
);

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="h-12 w-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all">
    <Icon className="h-5 w-5" />
  </a>
);

export default Contact;