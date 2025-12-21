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
import { UserPlus, ShieldPlus, ChevronRight } from "lucide-react";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Security Breach",
                description: "Password mismatch detected.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                toast({
                    title: "Registration Logged",
                    description: "Verify your email to activate the session.",
                });
                navigate("/login");
            }

        } catch (error: any) {
            toast({
                title: "Registry Failed",
                description: error.message || "Credential rejection by system core.",
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl aspect-square bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-[540px] space-y-12 animate-fade-in relative z-10">
                    <div className="text-center space-y-4">
                        <img src={nashiedLogo} alt="Nashied Logo" className="mx-auto h-14 w-auto" />
                        <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">
                            Associate Registry
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                            Create a new identity within the Nashied ecosystem.
                        </p>
                    </div>

                    <Card className="border-foreground/10 bg-foreground/[0.02] backdrop-blur-2xl shadow-2xl rounded-[40px] overflow-hidden">
                        <CardHeader className="pt-10 px-10">
                            <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                                <UserPlus className="h-5 w-5 text-orange-500" /> New Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Full Entity Name</Label>
                                    <Input
                                        placeholder="Aris Nashied"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">System Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="name@corp.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Access Pass</Label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Confirm Pass</Label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="h-14 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-bold"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-[#ff8c04] hover:bg-[#e67a00] text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-orange-500/20" disabled={isLoading}>
                                    {isLoading ? "Provisioning..." : "Create Security Identity"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="bg-foreground/5 px-10 py-8 border-t border-foreground/5 flex flex-col gap-6">
                            <div className="text-[10px] font-black uppercase tracking-widest text-center text-foreground/40">
                                Existing identity?{" "}
                                <Link to="/login" className="text-orange-500 hover:text-orange-400">
                                    Activate Login Node
                                </Link>
                            </div>
                            <div className="flex items-center justify-center gap-3 px-6 py-3 bg-foreground/5 rounded-xl border border-foreground/10">
                                <ShieldPlus className="h-4 w-4 text-orange-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">Registry Governance Protocol Active</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Signup;
