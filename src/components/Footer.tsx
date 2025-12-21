import nashiedLogo from "@/assets/nashied-logo.png";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-navy text-white pt-32 pb-16 transition-colors duration-500 selection:bg-[#ff8c04]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Top Section */}
                    <div className="grid lg:grid-cols-12 gap-20 mb-20">
                        <div className="lg:col-span-5 space-y-10">
                            <img src={nashiedLogo} alt="Nashied Digital Boutique" className="h-12 w-auto" />
                            <p className="text-xl text-white/60 font-medium leading-relaxed max-w-sm">
                                A high-output, AI-powered digital agency. We engineer bespoke brands and high-performance digital products for global impact.
                            </p>
                            <div className="flex gap-6">
                                <SocialLink icon={Facebook} href="https://www.facebook.com/naShiEdDigitalBotique" />
                                <SocialLink icon={Linkedin} href="https://www.linkedin.com/company/106106936/" />
                                <SocialLink icon={Twitter} href="https://x.com/NashiedDigital" />
                                <SocialLink icon={Instagram} href="https://www.instagram.com/nashied_digital/" />
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8c04]">Navigation</h4>
                                <ul className="space-y-4">
                                    <FooterLink href="/work" label="Case Studies" />
                                    <FooterLink href="/services" label="Matrix of Services" />
                                    <FooterLink href="/about" label="The Mandate" />
                                    <FooterLink href="/contact" label="Initiate Contact" />
                                </ul>
                            </div>
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8c04]">Infrastructure</h4>
                                <ul className="space-y-4">
                                    <FooterLink href="/login" label="Staff Command" />
                                    <FooterLink href="/signup" label="Associate Registry" />
                                    <FooterLink href="#" label="Infrastructure Status" isExternal />
                                    <FooterLink href="#" label="Cloud Archive" isExternal />
                                </ul>
                            </div>
                            <div className="col-span-2 md:col-span-1 space-y-8">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8c04]">Nexus Point</h4>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-white/40 mt-1" />
                                        <p className="text-xs text-white/60 font-medium leading-relaxed">
                                            1 Ward Road, Braeside <br />
                                            Harare, Zimbabwe
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-white/40" />
                                        <a href="mailto:info@nashieddigital.co.zw" className="text-xs text-white/60 hover:text-white transition-colors">info@nashieddigital.co.zw</a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-white/40" />
                                        <a href="tel:+263785394667" className="text-xs text-white/60 hover:text-white transition-colors">+263 785 394 667</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                            © 2024 NASHIED DIGITAL BOUTIQUE. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-10">
                            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Legal Archive</a>
                            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Protocol</a>
                            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Cookie Ledger</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ href, label, isExternal }: { href: string, label: string, isExternal?: boolean }) => (
    <li>
        <a
            href={href}
            className="text-sm font-medium text-white/60 hover:text-[#ff8c04] transition-colors inline-flex items-center gap-1 group"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {label}
        </a>
    </li>
);

const SocialLink = ({ icon: Icon, href }: { icon: any, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white/60 hover:text-[#ff8c04] hover:bg-[#ff8c04]/10 transition-all border border-transparent hover:border-[#ff8c04]/20">
        <Icon className="h-5 w-5" />
    </a>
);

export default Footer;
