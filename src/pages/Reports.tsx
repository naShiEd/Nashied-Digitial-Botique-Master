import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    BarChart3,
    TrendingUp,
    ArrowDownRight,
    ArrowUpRight,
    PieChart,
    Calendar,
    Download,
    Filter,
    FileText,
    Receipt,
    History,
    Target,
    Activity,
    CreditCard,
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    PieChart as RePieChart,
    Pie,
    Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        stats: {},
        revenueTrend: [],
        agedReceivables: [],
        pipelineStatus: []
    });

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const [
                { data: invoices },
                { data: bills },
                { data: quotes },
                { data: projects }
            ] = await Promise.all([
                supabase.from('invoices').select('*'),
                supabase.from('bills').select('*'),
                supabase.from('quotes').select('*'),
                supabase.from('projects').select('*')
            ]);

            const now = new Date();

            // 1. Calculate Monthly Trend (Last 6 Months)
            const revenueTrend = Array.from({ length: 6 }).map((_, i) => {
                const date = subMonths(now, 5 - i);
                const monthName = format(date, 'MMM');
                const interval = { start: startOfMonth(date), end: endOfMonth(date) };

                const monthRevenue = (invoices || [])
                    .filter(inv => inv.status === 'paid' && isWithinInterval(new Date(inv.created_at), interval))
                    .reduce((sum, inv) => sum + inv.total_amount, 0);

                const monthExpenses = (bills || [])
                    .filter(b => b.status === 'paid' && isWithinInterval(new Date(b.created_at), interval))
                    .reduce((sum, b) => sum + b.total_amount, 0);

                return { name: monthName, revenue: monthRevenue, expenses: monthExpenses };
            });

            // 2. Calculate Aged Receivables
            const aged = [
                { range: '0-30 days', amount: 0, color: '#3b82f6' },
                { range: '31-60 days', amount: 0, color: '#f59e0b' },
                { range: '61-90 days', amount: 0, color: '#ef4444' },
                { range: '90+ days', amount: 0, color: '#7f1d1d' }
            ];

            (invoices || []).filter(i => i.status !== 'paid' && i.status !== 'cancelled').forEach(inv => {
                const days = differenceInDays(now, new Date(inv.due_date));
                const balance = inv.total_amount - (inv.amount_paid || 0);
                if (days <= 30) aged[0].amount += balance;
                else if (days <= 60) aged[1].amount += balance;
                else if (days <= 90) aged[2].amount += balance;
                else aged[3].amount += balance;
            });

            // 3. Pipeline Metrics
            const pipelineStatus = [
                { name: 'Draft', value: quotes?.filter(q => q.status === 'draft').length || 0 },
                { name: 'Sent', value: quotes?.filter(q => q.status === 'sent').length || 0 },
                { name: 'Accepted', value: quotes?.filter(q => q.status === 'accepted').length || 0 },
                { name: 'Declined', value: quotes?.filter(q => q.status === 'declined').length || 0 }
            ];

            const totalRevenue = (invoices || []).filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0);
            const totalExpenses = (bills || []).filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total_amount, 0);
            const conversionRate = quotes?.length ? Math.round(((quotes.filter(q => q.status === 'accepted').length) / quotes.length) * 100) : 0;

            setData({
                stats: {
                    revenue: totalRevenue,
                    expenses: totalExpenses,
                    profit: totalRevenue - totalExpenses,
                    conversionRate,
                    activeProjects: projects?.length || 0,
                    potentialRevenue: (quotes || []).filter(q => q.status === 'sent').reduce((sum, q) => sum + q.total_amount, 0)
                },
                revenueTrend,
                agedReceivables: aged,
                pipelineStatus
            });
        } catch (err) {
            console.error("Report intelligence error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout headerTitle="Business Intelligence Units">
            <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in pb-20">

                {/* COMMAND HEADER */}
                <div className="flex justify-between items-end bg-card p-10 rounded-3xl border border-border/40 shadow-2xl shadow-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5">
                        <Activity className="h-64 w-64 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black font-display tracking-tight text-foreground uppercase">Revenue Matrix</h2>
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest px-3 py-1">2025 FISCAL</Badge>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-60">Architecting global agency performance data</p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <Button variant="outline" className="h-12 rounded-xl border-border/60 font-black text-[11px] uppercase tracking-widest px-8 hover:bg-muted transition-all">
                            <Download className="mr-3 h-4 w-4" /> Export Financial PDF
                        </Button>
                        <Button className="h-12 rounded-xl bg-primary hover:bg-primary/95 font-black text-[11px] uppercase tracking-widest px-8 shadow-xl shadow-primary/20 transition-all">
                            <Calendar className="mr-3 h-4 w-4" /> Global Filter
                        </Button>
                    </div>
                </div>

                {/* KPI TOP BAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <KPICard title="Operative Profit" value={`$${data.stats.profit?.toLocaleString()}`} trend="+14.2%" icon={Briefcase} color="text-primary" />
                    <KPICard title="Revenue Pipeline" value={`$${data.stats.potentialRevenue?.toLocaleString()}`} trend="High Probability" icon={Target} color="text-blue-500" />
                    <KPICard title="Effective Conversion" value={`${data.stats.conversionRate}%`} trend="Draft to Accepted" icon={Activity} color="text-green-500" />
                    <KPICard title="Active Mandates" value={data.stats.activeProjects} trend="Production Load" icon={History} color="text-orange-500" />
                </div>

                {/* PRIMARY INTELLIGENCE: TRENDS & AGED RECEIVABLES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Monthly Trajectory (Recharts AreaChart) */}
                    <Card className="lg:col-span-2 border-border/40 shadow-2xl rounded-3xl bg-card overflow-hidden">
                        <CardHeader className="p-8 border-b border-border/10">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" /> Performance Trajectory
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-60">6-Month Revenue vs Expenditure Analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.revenueTrend}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                        itemStyle={{ padding: '4px 0' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Aged Receivables (Recharts BarChart) */}
                    <Card className="border-border/40 shadow-2xl rounded-3xl bg-card overflow-hidden">
                        <CardHeader className="p-8 border-b border-border/10">
                            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-orange-500" /> Aged Receivables
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-60">Outstanding Debt Distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.agedReceivables} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={32}>
                                        {data.agedReceivables.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* SECONDARY INTELLIGENCE: PIPELINE & LIABILITY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Pipeline Breakdown (PieChart) */}
                    <Card className="border-border/40 shadow-2xl rounded-3xl bg-card overflow-hidden">
                        <CardContent className="p-10 flex items-center gap-10">
                            <div className="h-[250px] w-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={data.pipelineStatus}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {data.pipelineStatus.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#3b82f6', '#10b981', '#ef4444'][index % 4]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-1/2 space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Proposal Velocity</h3>
                                <p className="text-xs text-muted-foreground font-medium italic">Breakdown of current sales efforts and conversion health.</p>
                                <div className="space-y-2 pt-4">
                                    {data.pipelineStatus.map((p: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#ef4444'][i % 4] }} />
                                                {p.name}
                                            </div>
                                            <span>{p.value} UNITS</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statutory Intelligence */}
                    <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 opacity-5">
                            <Target className="h-48 w-48 text-primary" />
                        </div>
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter text-primary">Regional Compliance Hub</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Estimated Statutory Projections (Zimbabwe Jurisdiction)</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 grid grid-cols-2 gap-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estimated Q1 CIT</p>
                                <p className="text-3xl font-black text-foreground">${(data.stats.profit * 0.25).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aggregate VAT Pool</p>
                                <p className="text-3xl font-black text-foreground">${(data.stats.revenue * 0.15).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 p-6 rounded-2xl bg-white/50 border border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg"><Activity className="h-4 w-4 text-white" /></div>
                                    <span className="text-xs font-black uppercase">Statutory Safety Margin</span>
                                </div>
                                <span className="text-xl font-black text-green-600">35.4%</span>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </DashboardLayout>
    );
};

const KPICard = ({ title, value, trend, icon: Icon, color }: any) => (
    <Card className="border-border/40 shadow-xl rounded-3xl bg-card hover:border-primary/20 transition-all group overflow-hidden">
        <CardContent className="p-8 space-y-4">
            <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl bg-muted transition-transform group-hover:scale-110", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <Badge className="bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest border-none">Live Sync</Badge>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black font-display tracking-tight text-foreground">{value}</h3>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">{trend}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default Reports;
