import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Server,
    Globe,
    Mail,
    ShieldAlert,
    TrendingUp,
    Activity,
    Clock,
    MoreHorizontal,
    CreditCard,
    DollarSign,
    Zap,
    ZapOff,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle as CardHeaderTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Service {
    id: string;
    client_id: string;
    name: string;
    type: 'hosting' | 'domain' | 'email' | 'maintenance';
    renewal_price: number;
    cycle: 'monthly' | 'yearly';
    next_due_date: string;
    status: 'active' | 'suspended' | 'cancelled';
    currency: string;
    client: { company_name: string } | null;
}

const ServicesDashboard = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [newService, setNewService] = useState({
        client_id: '',
        name: '',
        type: 'hosting',
        renewal_price: 0,
        cycle: 'monthly',
        next_due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'active',
        currency: 'USD'
    });

    // Stats Logic
    const stats = useMemo(() => {
        const active = services.filter(s => s.status === 'active');
        const monthlyTotal = active.reduce((sum, s) => {
            const val = s.renewal_price || 0;
            return sum + (s.cycle === 'monthly' ? val : val / 12);
        }, 0);

        return {
            totalRecurring: monthlyTotal,
            activeServices: active.length,
            expiringSoon: active.filter(s => {
                const diff = new Date(s.next_due_date).getTime() - new Date().getTime();
                return diff < 15 * 24 * 60 * 60 * 1000; // 15 days
            }).length
        };
    }, [services]);

    useEffect(() => {
        fetchServices();
        fetchClients();
    }, []);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, client:clients(company_name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // @ts-ignore
            setServices(data || []);
        } catch (error: any) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        const { data } = await supabase.from('clients').select('id, company_name');
        setClients(data || []);
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('services').insert([newService]);
            if (error) throw error;

            toast({
                title: "Asset Provisioned",
                description: `Infrastructure for ${newService.name} has been initialized.`
            });
            setIsDialogOpen(false);
            setNewService({
                client_id: '',
                name: '',
                type: 'hosting',
                renewal_price: 0,
                cycle: 'monthly',
                next_due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                status: 'active',
                currency: 'USD'
            });
            fetchServices();
        } catch (error: any) {
            toast({ title: "Provisioning Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredServices = useMemo(() => {
        return services.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.client?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    const getServiceMeta = (type: string) => {
        switch (type) {
            case 'domain': return { icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' };
            case 'email': return { icon: Mail, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' };
            case 'maintenance': return { icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' };
            default: return { icon: Server, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' };
        }
    };

    return (
        <DashboardLayout headerTitle="Infrastructure Hub">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">

                {/* 1️⃣ STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-card border-border/40 shadow-2xl rounded-[32px] overflow-hidden group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] opacity-60">Monthly Recurring Revenue</p>
                                    <h3 className="text-4xl font-bold font-display tracking-tighter flex items-center gap-1">
                                        <span className="text-xl font-bold opacity-30">$</span>
                                        {stats.totalRecurring.toLocaleString()}
                                    </h3>
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1.5 pt-2">
                                        <TrendingUp className="h-3 w-3" /> Growth: +12.4% <span className="text-muted-foreground/40 text-[9px]">MoM</span>
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Activity className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/40 shadow-2xl rounded-[32px] overflow-hidden group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] opacity-60">Active Assets</p>
                                    <h3 className="text-4xl font-bold font-display tracking-tighter">{stats.activeServices}</h3>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest pt-2">Infrastructure Operational</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Server className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/40 shadow-2xl rounded-[32px] overflow-hidden group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] opacity-60">Renewal Pipeline</p>
                                    <h3 className="text-4xl font-bold font-display tracking-tighter">{stats.expiringSoon}</h3>
                                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest pt-2 flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Due Within 15 Days
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2️⃣ COMMAND STRIP */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 rounded-[28px] border border-border/50 gap-4 shadow-xl shadow-primary/5">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter active infrastructure..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 rounded-[18px] border-border/60 bg-muted/20 font-bold focus-visible:ring-primary/20"
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-8 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 bg-primary">
                                <Plus className="mr-2 h-4 w-4" /> Provision New Asset
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl rounded-[32px] border-none shadow-2xl">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle className="text-2xl font-bold uppercase tracking-tighter">Asset Provisioning</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateService} className="p-6 grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Account Holder</Label>
                                    <Select value={newService.client_id} onValueChange={(val) => setNewService({ ...newService, client_id: val })} required>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Client Account" /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {clients.map(c => <SelectItem key={c.id} value={c.id} className="font-bold text-[10px] uppercase">{c.company_name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Asset Identity / Name</Label>
                                    <Input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} required placeholder="e.g. Agency Cloud Cluster 01" className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Service Architecture</Label>
                                    <Select value={newService.type} onValueChange={(val) => setNewService({ ...newService, type: val as any })}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="hosting" className="font-bold text-[10px] uppercase">Cloud Hosting</SelectItem>
                                            <SelectItem value="domain" className="font-bold text-[10px] uppercase">Domain Asset</SelectItem>
                                            <SelectItem value="email" className="font-bold text-[10px] uppercase">Business Email</SelectItem>
                                            <SelectItem value="maintenance" className="font-bold text-[10px] uppercase">SLA Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Billing Frequency</Label>
                                    <Select value={newService.cycle} onValueChange={(val) => setNewService({ ...newService, cycle: val as any })}>
                                        <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="monthly" className="font-bold text-[10px] uppercase">Monthly Ledger</SelectItem>
                                            <SelectItem value="yearly" className="font-bold text-[10px] uppercase">Annual Retainer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Billing Value (USD)</Label>
                                    <Input type="number" value={newService.renewal_price} onChange={(e) => setNewService({ ...newService, renewal_price: parseFloat(e.target.value) })} required className="h-12 rounded-xl font-bold text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Next Renewal Point</Label>
                                    <Input type="date" value={newService.next_due_date} onChange={(e) => setNewService({ ...newService, next_due_date: e.target.value })} required className="h-12 rounded-xl" />
                                </div>
                                <Button type="submit" className="col-span-2 h-14 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 mt-4">Initiate Provisioning</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* 3️⃣ SERVICE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((svc) => {
                        const meta = getServiceMeta(svc.type);
                        const Icon = meta.icon;
                        const isExpiring = new Date(svc.next_due_date).getTime() - new Date().getTime() < 15 * 24 * 60 * 60 * 1000;

                        return (
                            <Card key={svc.id} className="group border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[40px] overflow-hidden bg-white hover:border-primary/40 transition-all hover:-translate-y-1">
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className={cn("h-16 w-16 rounded-[22px] flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", meta.bg)}>
                                            <Icon className={cn("h-8 w-8", meta.color)} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={cn("text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none",
                                                svc.status === 'active' ? 'bg-green-500 text-white' :
                                                    svc.status === 'suspended' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                            )}>
                                                {svc.status}
                                            </Badge>
                                            {isExpiring && svc.status === 'active' && (
                                                <Badge variant="outline" className="animate-pulse bg-red-50 text-red-600 border-red-100 text-[8px] font-bold uppercase tracking-tighter">Renewal Required</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-xl tracking-tighter uppercase leading-tight truncate">{svc.name}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 truncate">{svc.client?.company_name}</p>
                                    </div>

                                    <div className="flex justify-between items-end bg-muted/20 p-5 rounded-[24px] border border-divider/5">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest opacity-50 mb-1">Billing Loop</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-bold opacity-30">$</span>
                                                <span className="text-2xl font-bold tracking-tighter">{svc.renewal_price.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 ml-1">/{svc.cycle === 'monthly' ? 'MO' : 'YR'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest opacity-50 mb-1">Next Cycle</p>
                                            <p className={cn("text-sm font-bold tracking-tight uppercase", isExpiring ? "text-red-600" : "text-foreground")}>
                                                {new Date(svc.next_due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-8 py-4 bg-muted/5 border-t border-border/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"><Mail className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"><Activity className="h-4 w-4" /></Button>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
                                                Manage <MoreHorizontal className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2 border-border/50 shadow-2xl">
                                            <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-2 p-3"><Zap className="h-4 w-4 text-orange-500" /> Suspension Protocol</DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-2 p-3"><CreditCard className="h-4 w-4 text-primary" /> Modify Billing</DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-2 p-3"><ShieldAlert className="h-4 w-4 text-blue-500" /> Infrastructure Logs</DropdownMenuItem>
                                            <div className="h-px bg-divider/10 my-2" />
                                            <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-2 p-3 text-destructive"><ZapOff className="h-4 w-4" /> Terminate Service</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </Card>
                        );
                    })}

                    {!loading && services.length === 0 && (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center bg-muted/10 rounded-[60px] border-2 border-dashed border-border/50">
                            <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center opacity-20 mb-6">
                                <ZapOff className="h-12 w-12" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Dark Cluster: No Active Infrastructure</p>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase mt-2">Provision your first recurring asset to begin telemetry.</p>
                            <Button onClick={() => setIsDialogOpen(true)} className="mt-8 rounded-2xl h-12 px-10 font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20">Provision Genesis Asset</Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ServicesDashboard;
