import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send, MessageCircle, ShieldCheck, Zap, Target, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProjectInquiry = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        entities: "",
        details: "",
        budget: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Construct WhatsApp message
        const message = `
🎯 *New Project Inquiry*

👤 *Contact Information:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

📋 *Project Details:*
Type: ${formData.projectType}
Relevant Entities: ${formData.entities}

💡 *Description:*
${formData.details}

💰 *Budget:* ${formData.budget}

---
Sent via Nashied Digital Boutique (v2.0)
    `.trim();

        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/263785394667?text=${encodedMessage}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const projectTypes = [
        "Brand Strategy & Identity",
        "System / Product Architecture",
        "AI Integration & Automation",
        "Social Content Production",
        "Performance Marketing Hub",
        "Web / App Engineering",
        "Enterprise Transformation",
        "Other Vision"
    ];

    return (
        <div className="min-h-screen bg-nashied-navy text-white selection:bg-orange-500/30 selection:text-orange-500">
            <Navigation />

            <section className="pt-48 pb-32 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-20">

                        {/* 1️⃣ SIDEBAR INFO */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                    <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Inquiry Pipeline</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none uppercase">
                                    Initiate <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Build.</span>
                                </h1>
                                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                                    Fill out the mission debrief below. Our leads will analyze your requirements and connect via our secure WhatsApp response channel.
                                </p>
                            </div>

                            <div className="space-y-8 pt-8">
                                <Advantage label="5X Fast Production" icon={Zap} />
                                <Advantage label="AI-Powered Precision" icon={Target} />
                                <Advantage label="Premium Zimbabwean Heart" icon={Rocket} />
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-orange-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Privacy Protocol</p>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">Your data is transmitted via secure TLS and logged in our internal ERP for staff follow-up. We value institutional secrecy.</p>
                            </div>
                        </div>

                        {/* 2️⃣ FORM CONTAINER */}
                        <div className="lg:col-span-7">
                            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[48px] backdrop-blur-xl space-y-10 shadow-2xl relative group">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold italic text-sm">01</div>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Identity & Reach</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</Label>
                                            <Input name="name" required value={formData.name} onChange={handleChange} placeholder="Tony Stark" className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold text-white placeholder:text-white/30" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 ml-1">Phone / WhatsApp</Label>
                                            <Input name="phone" required value={formData.phone} onChange={handleChange} placeholder="+263 7..." className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold text-white placeholder:text-white/30" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 ml-1">Email Endpoint</Label>
                                        <Input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="stark@avengers.com" className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold text-white placeholder:text-white/30" />
                                    </div>
                                </div>

                                <div className="space-y-8 pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold italic text-sm text-white">02</div>
                                        <h3 className="text-2xl font-bold uppercase tracking-tight">Project Architecture</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 ml-1">Primary Objective</Label>
                                            <select
                                                name="projectType"
                                                required
                                                value={formData.projectType}
                                                onChange={handleChange}
                                                className="w-full h-16 rounded-2xl bg-[#131b2e] border border-white/10 px-6 text-lg font-bold appearance-none focus:ring-2 focus:ring-orange-500 text-white"
                                            >
                                                <option value="">Select Service...</option>
                                                {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 ml-1">Budget Index (USD)</Label>
                                            <Input name="budget" required value={formData.budget} onChange={handleChange} placeholder="e.g. 5,000+" className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold text-white placeholder:text-white/30" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 ml-1">Core Requirements / Concept</Label>
                                        <Textarea
                                            name="details"
                                            required
                                            value={formData.details}
                                            onChange={handleChange}
                                            placeholder="What are we building exactly? Define the vision..."
                                            className="min-h-[160px] rounded-[32px] bg-white/5 border-white/10 text-lg font-bold p-10 focus:ring-2 focus:ring-orange-500 text-white placeholder:text-white/30"
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-24 rounded-[32px] bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-sm tracking-[0.2em] shadow-2xl shadow-orange-500/20 active:scale-[0.98] transition-all">
                                    <MessageCircle className="mr-3 h-6 w-6" /> Deploy via WhatsApp Secure <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>

                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/20">Encryption: Protocol 256-AES Active</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-20" />
        </div>
    );
};

const Advantage = ({ label, icon: Icon }: any) => (
    <div className="flex items-center gap-4 group cursor-default">
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-all">
            <Icon className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold uppercase tracking-tight text-white/60 group-hover:text-white transition-colors">{label}</span>
    </div>
);

export default ProjectInquiry;
