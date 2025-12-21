import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section id="contact" className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden transition-colors duration-500 selection:bg-orange-500/30">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20">

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Nexus Channel Online</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase">
                Connect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Network.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
                Initiate a consultation with our strategic leads. We respond to mission-critical inquiries within 4-6 business hours.
              </p>
            </div>

            <div className="space-y-10">
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
              />
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <form className="bg-foreground/5 border border-foreground/10 p-10 md:p-16 rounded-[48px] backdrop-blur-xl space-y-8 shadow-2xl relative group">
              <h3 className="text-3xl font-bold uppercase tracking-tighter italic">Inquiry Protocol</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Identity / Full Name</Label>
                  <Input placeholder="Aris Nashied" className="h-16 rounded-2xl bg-foreground/5 border-foreground/10 text-lg font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Communication Endpoint</Label>
                  <Input type="email" placeholder="aris@nashied.agency" className="h-16 rounded-2xl bg-foreground/5 border-foreground/10 text-lg font-bold" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Mission Objective</Label>
                <Textarea placeholder="Describe the project architecture..." className="min-h-[160px] rounded-[32px] bg-foreground/5 border-foreground/10 text-lg font-bold p-10" />
              </div>

              <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs tracking-[0.2em] shadow-2xl shadow-orange-500/20 active:scale-95 transition-all">
                Execute Transmission <Send className="ml-3 h-5 w-5" />
              </Button>

              <div className="flex items-center justify-center gap-4 pt-4 text-[10px] font-bold uppercase tracking-widest text-foreground/20">
                <ShieldCheck className="h-4 w-4" /> Secure TLS Encryption Enabled
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactItem = ({ icon: Icon, label, value, href }: any) => {
  const content = (
    <div className="flex items-start gap-6 group">
      <div className="h-14 w-14 bg-foreground/5 border border-foreground/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
        <Icon className="h-6 w-6 text-foreground group-hover:text-white transition-colors" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 group-hover:text-orange-500 transition-colors uppercase">{label}</p>
        <p className="text-2xl font-bold uppercase tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );

  if (href) return <a href={href} className="block">{content}</a>;
  return content;
};

export default Contact;
