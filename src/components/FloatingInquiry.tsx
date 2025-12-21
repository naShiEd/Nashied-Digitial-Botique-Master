import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Zap, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingInquiry = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        vision: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `
🎯 *Lead Capture: Quick Inquiry*

👤 *Identity:* ${formData.name}
📱 *WhatsApp:* ${formData.phone}

💡 *Project Vision:*
${formData.vision}

---
Source: Floating Lead Protocol
        `.trim();

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/263785394667?text=${encodedMessage}`, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-6 pointer-events-none">
            {/* The Form */}
            <div className={cn(
                "w-[350px] md:w-[400px] bg-nashied-navy border border-white/10 rounded-[32px] shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-right pointer-events-auto",
                isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-20 pointer-events-none"
            )}>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <Zap className="h-4 w-4 text-white fill-white" />
                            </div>
                            <h3 className="font-bold uppercase tracking-widest text-xs">Mission Brief</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-2xl font-bold tracking-tighter uppercase leading-none">Initialize <br /> <span className="text-orange-500">The Build.</span></h4>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Connect with our Lead Production Team.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <Input
                                required
                                placeholder="Identity (Name)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-orange-500/50 font-bold text-xs text-white placeholder:text-white/30"
                            />
                            <Input
                                required
                                placeholder="WhatsApp Protocol (+263...)"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-orange-500/50 font-bold text-xs text-white placeholder:text-white/30"
                            />
                            <Textarea
                                required
                                placeholder="Project Vision / Objective..."
                                value={formData.vision}
                                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                className="min-h-[100px] bg-white/5 border-white/10 rounded-xl focus:ring-orange-500/50 font-bold text-xs p-4 text-white placeholder:text-white/30"
                            />
                        </div>

                        <Button type="submit" className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20">
                            Execute Deployment <Send className="h-3.5 w-3.5" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
                            <ShieldCheck className="h-3 w-3" /> Encrypted Direct Channel
                        </div>
                    </form>
                </div>
            </div>

            {/* The Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-4 pointer-events-auto animate-bounce-subtle"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 py-3 px-6 rounded-full hidden md:block group-hover:bg-white/10 transition-all border-r-0 rounded-r-none translate-x-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Start Project Inquiry</span>
                    </div>
                    <div className="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 transition-all group-hover:rotate-12">
                        <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                </button>
            )}
        </div>
    );
};
