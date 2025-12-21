import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import nashiedLogo from "@/assets/nashied-logo.png";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, ArrowRight, Zap } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            toast({ title: "Access Granted", description: "Identity verified. Initializing dashboard..." });
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Access Denied",
                description: error.message || "Invalid credentials provided to the security node.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col selection:bg-orange-500/30 transition-colors duration-500">
            <Navigation />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-[480px] space-y-12 animate-fade-in relative z-10">


                    <Card className="border-foreground/10 bg-foreground/[0.02] backdrop-blur-2xl shadow-2xl rounded-[40px] overflow-hidden">
                        <CardHeader className="pt-10 px-10">
                            <CardTitle className="text-2xl font-bold uppercase tracking-tight text-foreground flex items-center gap-3">
                                <Lock className="h-5 w-5 text-orange-500" /> Security Login
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Personnel Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="id@nashied.agency"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Access Protocol (Password)</Label>
                                    </div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold focus:ring-orange-500"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-[#ff8c04] hover:bg-[#e67a00] text-white font-bold uppercase text-xs tracking-widest shadow-2xl shadow-orange-500/20" disabled={isLoading}>
                                    {isLoading ? "Verifying..." : "Initialize Dashboard Session"}
                                </Button>

                                <div className="text-center pt-2">
                                    <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 hover:text-orange-500 transition-colors">
                                        Reset Access Credentials
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-foreground/5 px-10 py-8 border-t border-foreground/5 flex flex-col gap-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-center text-foreground/40">
                                No active account?{" "}
                                <Link to="/signup" className="text-orange-500 hover:text-orange-400">
                                    Register New Associate
                                </Link>
                            </div>
                            <div className="flex items-center justify-center gap-3 px-6 py-3 bg-foreground/5 rounded-xl border border-foreground/10">
                                <ShieldCheck className="h-4 w-4 text-orange-500" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30">AES-256 TLS Encryption Active</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
