import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
    User,
    Shield,
    Zap,
    Building2,
    CreditCard,
    Palette,
    Globe,
    FileText,
    Save,
    CheckCircle2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface OrgProfile {
    id: string;
    name: string;
    legal_name: string;
    tax_number: string;
    reg_number: string;
    email: string;
    phone: string;
    website: string;
    address_street: string;
    address_city: string;
    address_country: string;
    base_currency: string;
    invoice_prefix: string;
    quote_prefix: string;
    logo_url: string;
}

const Settings = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [org, setOrg] = useState<Partial<OrgProfile>>({
        name: 'Nashied Digital Boutique',
        base_currency: 'USD',
        invoice_prefix: 'INV-',
        quote_prefix: 'QT-'
    });
    const [fullName, setFullName] = useState(profile?.full_name || "");

    useEffect(() => {
        if (profile) setFullName(profile.full_name || "");
    }, [profile]);

    useEffect(() => {
        fetchOrgProfile();
    }, []);

    const fetchOrgProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('organization_profile')
                .select('*')
                .maybeSingle();

            if (error) throw error;
            if (data) setOrg(data);
        } catch (error: any) {
            console.error('Error fetching org:', error.message);
        }
    };

    const handleSaveOrg = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('organization_profile')
                .upsert({ ...org, id: org.id || '00000000-0000-0000-0000-000000000000' });

            if (error) throw error;
            toast({
                title: "Configuration Synchronized",
                description: "Global business metadata has been updated across the cluster.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user?.id);

            if (error) throw error;
            toast({
                title: "Identity Mirrored",
                description: "Your account metadata has been updated across the network.",
            });
        } catch (error: any) {
            toast({
                title: "Sync Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout headerTitle="Intelligence Center">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
                <div className="flex justify-between items-end bg-card p-8 rounded-3xl border border-border/50 shadow-xl shadow-primary/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">Command Center</h2>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-widest">Version 4.0.1</Badge>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Architecting the global operations of {org.name}</p>
                    </div>
                </div>

                <Tabs defaultValue="organization" className="w-full">
                    <div className="flex overflow-x-auto pb-2 mb-8">
                        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/50 h-auto gap-1">
                            <TabsTrigger value="organization" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 transition-all gap-2">
                                <Building2 className="h-3.5 w-3.5" /> Organization
                            </TabsTrigger>
                            <TabsTrigger value="financial" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 transition-all gap-2">
                                <CreditCard className="h-3.5 w-3.5" /> Financial Defaults
                            </TabsTrigger>
                            <TabsTrigger value="branding" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 transition-all gap-2">
                                <Palette className="h-3.5 w-3.5" /> Identity & Branding
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest h-11 px-6 transition-all gap-2">
                                <User className="h-3.5 w-3.5" /> Personal Access
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ORGANIZATION CONTENT */}
                    <TabsContent value="organization" className="mt-0 space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        <Card className="border-border/40 shadow-2xl rounded-3xl overflow-hidden bg-card/50 backdrop-blur-xl">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <Building2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold uppercase tracking-tighter">Business Infrastructure</CardTitle>
                                        <CardDescription>Legal registration and contact parameters for the master entity.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Trade Name</Label>
                                        <Input value={org.name} onChange={e => setOrg({ ...org, name: e.target.value })} className="h-12 rounded-xl border-border/60 bg-muted/20 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Legal Entity Name</Label>
                                        <Input value={org.legal_name} onChange={e => setOrg({ ...org, legal_name: e.target.value })} placeholder="Full Corporate Name" className="h-12 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Tax ID / VAT Number</Label>
                                        <Input value={org.tax_number} onChange={e => setOrg({ ...org, tax_number: e.target.value })} className="h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Business Reg Number</Label>
                                        <Input value={org.reg_number} onChange={e => setOrg({ ...org, reg_number: e.target.value })} className="h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Support Email</Label>
                                        <Input value={org.email} onChange={e => setOrg({ ...org, email: e.target.value })} placeholder="hello@youragency.com" className="h-11 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground text-primary">Regional Operations HQ</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input value={org.address_street} onChange={e => setOrg({ ...org, address_street: e.target.value })} placeholder="Street Address" className="h-11 rounded-xl col-span-2" />
                                        <Input value={org.address_city} onChange={e => setOrg({ ...org, address_city: e.target.value })} placeholder="City" className="h-11 rounded-xl" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 bg-muted/5 border-t border-border/10 flex justify-end">
                                <Button onClick={handleSaveOrg} disabled={loading} className="rounded-xl font-bold uppercase text-[11px] h-12 tracking-widest px-10 shadow-xl shadow-primary/20">
                                    {loading ? "Syncing..." : "Finalize Parameters"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* FINANCIAL DEFAULTS */}
                    <TabsContent value="financial" className="mt-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-border/40 shadow-2xl rounded-3xl overflow-hidden bg-card/50">
                                <CardHeader className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-orange-600/10 rounded-xl">
                                            <CreditCard className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold uppercase tracking-tighter text-orange-600">Monetary Core</CardTitle>
                                            <CardDescription>Default currencies and transaction behaviors.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Base Operations Currency</Label>
                                        <Input value={org.base_currency} onChange={e => setOrg({ ...org, base_currency: e.target.value })} className="h-12 rounded-xl font-bold text-lg bg-orange-50 border-orange-200" />
                                        <p className="text-[10px] text-muted-foreground/60 italic font-medium">All analytics and Profit & Loss reports will be indexed in this currency.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Invoice Prefix</Label>
                                            <Input value={org.invoice_prefix} onChange={e => setOrg({ ...org, invoice_prefix: e.target.value })} className="h-11 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Quote Prefix</Label>
                                            <Input value={org.quote_prefix} onChange={e => setOrg({ ...org, quote_prefix: e.target.value })} className="h-11 rounded-xl" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 bg-muted/5 border-t border-border/10 flex justify-end">
                                    <Button onClick={handleSaveOrg} disabled={loading} className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold uppercase text-[11px] h-12 tracking-widest px-10 shadow-xl shadow-orange-600/20">Save Financial Matrix</Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-primary/20 bg-primary/5 shadow-2xl rounded-3xl overflow-hidden border">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" /> Intelligence Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
                                    <Badge className="bg-green-500 text-white border-none py-1.5 px-4 font-bold uppercase tracking-widest">Financial Core Online</Badge>
                                    <p className="text-sm font-medium text-muted-foreground max-w-[280px]">Your business data is currently being reconciled across all active ledgers.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* BRANDING */}
                    <TabsContent value="branding" className="mt-0 space-y-6">
                        <Card className="border-border/40 shadow-2xl rounded-3xl overflow-hidden bg-card/50">
                            <CardHeader className="p-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-pink-600/10 rounded-xl">
                                        <Palette className="h-5 w-5 text-pink-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold uppercase tracking-tighter text-pink-600">Visual DNA</CardTitle>
                                        <CardDescription>Configure how your documents appear to clients.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-8">
                                <div className="flex gap-12 items-start">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Primary Logo (For Invoices/Quotes)</Label>
                                        <div className="h-48 w-48 rounded-3xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-3 bg-muted/20 group hover:border-primary transition-all cursor-pointer overflow-hidden p-4">
                                            {org.logo_url ? (
                                                <img src={org.logo_url} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <>
                                                    <Building2 className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Drop Vector Logo</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Logo URL (Remote Resource)</Label>
                                            <Input value={org.logo_url} onChange={e => setOrg({ ...org, logo_url: e.target.value })} placeholder="https://cdn.example.com/logo.png" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                                            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                                Tip: Use a transparent PNG or SVG for the best results on digital invoices.
                                                Recommended dimensions: 600x200px at 72dpi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 bg-muted/5 border-t border-border/10 flex justify-end">
                                <Button onClick={handleSaveOrg} disabled={loading} className="bg-pink-600 hover:bg-pink-700 rounded-xl font-bold uppercase text-[11px] h-12 tracking-widest px-10 shadow-xl shadow-pink-600/20">Archive Branding</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* PERSONAL ACCESS */}
                    <TabsContent value="profile" className="mt-0 space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <Card className="border-border/40 shadow-2xl rounded-3xl overflow-hidden bg-white/50">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-xl font-bold uppercase tracking-tighter flex items-center gap-3"><User className="h-5 w-5" /> Account Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Identity</Label>
                                            <Input value={fullName} onChange={e => setFullName(e.target.value)} className="h-11 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Registered Email</Label>
                                            <Input value={user?.email || ""} disabled className="h-11 rounded-xl bg-muted/40 opacity-60" />
                                        </div>
                                    </div>
                                    <Button onClick={handleUpdateProfile} disabled={loading} size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
                                        {loading ? "Mirroring..." : "Mirror Identity Changes"}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-border/40 shadow-2xl rounded-3xl overflow-hidden bg-white/50">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-xl font-bold uppercase tracking-tighter flex items-center gap-3"><Shield className="h-5 w-5" /> Security Protocol</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6 text-center">
                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 inline-block mb-4">
                                        <Badge className="bg-primary text-white mb-2">{profile?.role || "Subscriber"}</Badge>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Architect Access Level</p>
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        <Button variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Rotate Password</Button>
                                        <Button variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive/5">Enable 2FA</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
