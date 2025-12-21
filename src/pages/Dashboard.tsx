import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare, Briefcase, Users, DollarSign, Zap, ZapOff, ChevronDown, LayoutDashboard, TrendingUp, Activity, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { cn } from "@/lib/utils";

const Dashboard = () => {
    const [stats, setStats] = useState<any>({ tasks: 0, projects: 0, clients: 0, revenue: 0, receivables: 0, payables: 0 });
    const [cashFlowData, setCashFlowData] = useState<any[]>([]);
    const [daySession, setDaySession] = useState<{ status: 'open' | 'closed' } | null>(null);
    const { profile, user } = useAuth();
    const { toast } = useToast();

    const isAdmin = ['super_admin', 'admin'].includes(profile?.role || '');

    useEffect(() => {
        fetchStats();
        fetchDaySession();
    }, [profile]);

    const fetchDaySession = async () => {
        const { data } = await supabase
            .from('day_sessions')
            .select('*')
            .eq('session_date', new Date().toISOString().split('T')[0])
            .maybeSingle();
        setDaySession(data);
    };

    const toggleDay = async (action: 'start' | 'close') => {
        try {
            if (action === 'start') {
                const { error } = await supabase.from('day_sessions').insert([{ admin_id: user?.id }]);
                if (error) throw error;
                toast({ title: "Day Started", description: "Agency clock is now ticking. Team can log work." });
            } else {
                const { error } = await supabase
                    .from('day_sessions')
                    .update({ close_time: new Date().toISOString(), status: 'closed' })
                    .eq('session_date', new Date().toISOString().split('T')[0]);
                if (error) throw error;
                toast({ title: "Day Closed", description: "Production summary generated. Good work today!" });
            }
            fetchDaySession();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    const fetchStats = async () => {
        try {
            const [
                { data: invoices },
                { data: bills },
                { data: projects },
                { data: tasks }
            ] = await Promise.all([
                supabase.from('invoices').select('total_amount, amount_paid, status, created_at'),
                supabase.from('bills').select('total_amount, amount_paid, status, created_at'),
                supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'Active'),
                supabase.from('tasks').select('id', { count: 'exact' }).eq('status', 'pending')
            ]);

            const receivables = (invoices || []).reduce((sum, inv) => sum + (inv.total_amount - (inv.amount_paid || 0)), 0);
            const payables = (bills || []).reduce((sum, bill) => sum + (bill.total_amount - (bill.amount_paid || 0)), 0);
            const revenue = (invoices || []).filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0);

            // Calculate Cash Flow for chart (last 6 months)
            const now = new Date();
            const trend = Array.from({ length: 6 }).map((_, i) => {
                const date = subMonths(now, i);
                const monthName = format(date, 'MMM');
                const interval = { start: startOfMonth(date), end: endOfMonth(date) };

                const monthRev = (invoices || [])
                    .filter(inv => inv.status === 'paid' && isWithinInterval(new Date(inv.created_at), interval))
                    .reduce((sum, inv) => sum + inv.total_amount, 0);

                return { name: monthName, revenue: monthRev };
            }).reverse();

            setCashFlowData(trend);
            setStats({
                tasks: (tasks as any)?.length || 0,
                projects: projects?.length || 0,
                receivables,
                payables,
                revenue
            });

        } catch (error) {
            console.error("Stats fetch error:", error);
        }
    };

    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;

    return (
        <DashboardLayout headerTitle="Mission Control">
            <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12">

                {/* COMMAND GREETING */}
                <div className="bg-card border border-border/40 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-primary/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground uppercase">System: Online</h2>
                            <Badge variant={isWorkHours ? "outline" : "secondary"} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary/5 text-primary border-primary/20">
                                {isWorkHours ? "In-Work Session" : "Standby Mode"}
                            </Badge>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            Nashied Digital Boutique • {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="flex gap-3">
                            {daySession?.status !== 'open' ? (
                                <Button onClick={() => toggleDay('start')} className="h-12 px-8 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-green-600/20">
                                    <Zap className="mr-2 h-4 w-4" /> Initialize Workspace
                                </Button>
                            ) : (
                                <Button onClick={() => toggleDay('close')} variant="destructive" className="h-12 px-8 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-red-600/20">
                                    <ZapOff className="mr-2 h-4 w-4" /> Close Operations
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* KPI CLUSTER */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatsCard title="Receivables" value={`$${stats.receivables?.toLocaleString()}`} icon={Users} trend="Unpaid Invoices" color="text-primary" />
                    <StatsCard title="Payables" value={`$${stats.payables?.toLocaleString()}`} icon={DollarSign} trend="Unpaid Bills" color="text-red-500" />
                    <StatsCard title="Cash Position" value={`$${stats.revenue?.toLocaleString()}`} icon={Briefcase} trend="Net Realized" color="text-green-500" />
                    <StatsCard title="Active Build" value={stats.projects} icon={LayoutDashboard} trend="Production Queue" color="text-orange-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* RISK MONITOR */}
                    <Card className="lg:col-span-1 border-border/40 shadow-2xl rounded-3xl bg-card overflow-hidden">
                        <CardHeader className="p-8 border-b border-border/10">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                                Risk Inventory <Activity className="h-4 w-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <WatchItem label="Aged Debts (30+)" value={`$${stats.receivables?.toLocaleString()}`} color="text-red-500" />
                            <WatchItem label="Pending Payouts" value={`$${stats.payables?.toLocaleString()}`} color="text-orange-500" />
                            <WatchItem label="Monthly Burn" value={`$${(stats.payables / 3).toFixed(2)}`} color="text-blue-500" />
                            <WatchItem label="Entity Conversion" value="68.4%" color="text-green-500" />
                            <div className="pt-4 border-t border-border/10">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase italic leading-relaxed">
                                    Strategic insight: High receivable count detected. Recommend portal link distribution for aged debts.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CASH FLOW TRAJECTORY */}
                    <Card className="lg:col-span-2 border-border/40 shadow-2xl rounded-3xl bg-card overflow-hidden">
                        <CardHeader className="p-8 border-b border-border/10 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest">Revenue Velocity</CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">6-Month Liquidity Path</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronDown className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent className="p-8 h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlowData}>
                                    <defs>
                                        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#dashGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

const WatchItem = ({ label, value, color }: any) => (
    <div className="flex justify-between items-center group">
        <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <span className={cn("text-xs font-bold tabular-nums", color)}>{value}</span>
    </div>
);

const StatsCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="border-border/40 shadow-xl rounded-3xl bg-card hover:border-primary/20 transition-all group overflow-hidden">
        <CardContent className="p-8 space-y-4">
            <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl bg-muted transition-transform group-hover:scale-110", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <Badge className="bg-muted text-muted-foreground text-[9px] font-bold uppercase tracking-widest border-none">Sync active</Badge>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold font-display tracking-tight text-foreground">{value}</h3>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{trend}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default Dashboard;
