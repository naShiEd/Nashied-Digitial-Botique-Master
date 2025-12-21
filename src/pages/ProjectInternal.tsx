import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Activity,
    Briefcase,
    Calendar,
    ChevronLeft,
    DollarSign,
    FileText,
    LayoutDashboard,
    MoreHorizontal,
    ShieldCheck,
    Timer,
    Users,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    Lock,
    Settings,
    Layers
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectInternal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [stats, setStats] = useState({
        completedWeight: 0,
        totalHours: 0,
        burnRate: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projRes, tasksRes] = await Promise.all([
                supabase.from('projects').select('*, client:clients(company_name, email), assigned:profiles!assigned_to(full_name)').eq('id', id).single(),
                supabase.from('tasks').select('*, owner:profiles!assigned_to(full_name)').eq('project_id', id)
            ]);

            if (projRes.error) throw projRes.error;
            setProject(projRes.data);
            setTasks(tasksRes.data || []);

            // Calculate internal stats
            const total = tasksRes.data?.length || 0;
            const completed = tasksRes.data?.filter(t => t.status === 'completed').length || 0;
            const hours = (tasksRes.data?.reduce((sum, t) => sum + Number(t.total_active_seconds || 0), 0) || 0) / 3600;

            setStats({
                completedWeight: total > 0 ? (completed / total) * 100 : 0,
                totalHours: Number(hours.toFixed(1)),
                burnRate: Number((projRes.data.invoice_amount / (hours || 1)).toFixed(2))
            });

        } catch (error) {
            console.error("Error fetching project details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <DashboardLayout headerTitle="Loading Project Architecture...">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </DashboardLayout>
    );

    if (!project) return (
        <DashboardLayout headerTitle="Project Not Found">
            <div className="text-center py-20">
                <ShieldCheck className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <h3 className="text-xl font-bold uppercase tracking-widest">Project Artifact Not Found</h3>
                <Button onClick={() => navigate('/dashboard/projects')} className="mt-4 rounded-xl">Return to Command</Button>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout headerTitle={`Project Node: ${project.name}`}>
            <div className="max-w-[1500px] mx-auto space-y-8 animate-fade-in pb-20">

                {/* 1️⃣ BREADCRUMB & UTILS */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/dashboard/projects')} className="rounded-xl font-black uppercase text-[10px] tracking-widest group px-0 hover:bg-transparent">
                        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Project Cluster
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-divider/10 h-10 px-6">
                            <Settings className="mr-2 h-3.5 w-3.5" /> Project Config
                        </Button>
                        <Button className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-8 shadow-xl shadow-primary/20">
                            Launch Public Preview
                        </Button>
                    </div>
                </div>

                {/* 2️⃣ COMMAND HEADER */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="bg-[#111] text-white border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] rounded-[40px] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
                                <Layers className="h-64 w-64" />
                            </div>
                            <CardContent className="p-12 space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-primary text-white border-none px-4 py-1 font-black text-[9px] uppercase tracking-widest rounded-full">{project.status}</Badge>
                                        <div className="h-1 w-1 bg-white/20 rounded-full" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{project.type}</p>
                                    </div>
                                    <h2 className="text-6xl font-black tracking-tighter leading-none">{project.name}</h2>
                                    <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed">{project.description || 'No project description provided in metadata registry.'}</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Master Client</p>
                                        <p className="text-sm font-black uppercase truncate">{project.client?.company_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Internal Lead</p>
                                        <p className="text-sm font-black uppercase truncate">{project.assigned?.full_name || 'Unassigned'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Timeline Frame</p>
                                        <p className="text-sm font-black uppercase flex items-center gap-2">
                                            {new Date(project.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            <span className="text-white/20">—</span>
                                            {new Date(project.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Production Health</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${stats.completedWeight}%` }} />
                                            </div>
                                            <span className="text-xs font-black">{Math.round(stats.completedWeight)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="tasks" className="w-full">
                            <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-border/50 h-auto gap-2">
                                <TabsTrigger value="tasks" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest h-12 px-8">Production Tasks</TabsTrigger>
                                <TabsTrigger value="deliverables" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest h-12 px-8">Asset Repository</TabsTrigger>
                                <TabsTrigger value="financials" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest h-12 px-8">Project Commercials</TabsTrigger>
                            </TabsList>

                            <TabsContent value="tasks" className="mt-8">
                                <Card className="border-border/40 shadow-2xl rounded-[32px] overflow-hidden bg-white/50 backdrop-blur-xl ring-1 ring-black/5">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#111] text-white">
                                            <tr className="text-[9px] uppercase tracking-[0.2em] font-black">
                                                <th className="px-8 py-5">Objective</th>
                                                <th className="px-8 py-5">Assigned</th>
                                                <th className="px-8 py-5 text-center">Status</th>
                                                <th className="px-8 py-5 text-right">Production Loop</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-divider/5">
                                            {tasks.map((task) => (
                                                <tr key={task.id} className="group hover:bg-white transition-all">
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-xs uppercase tracking-tight">{task.title}</p>
                                                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Ref: #{task.id.slice(0, 8).toUpperCase()}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                                                                {task.owner?.full_name?.charAt(0) || "U"}
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{task.owner?.full_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full",
                                                            task.status === 'completed' ? 'border-green-200 text-green-600 bg-green-50' : 'border-orange-200 text-orange-600 bg-orange-50'
                                                        )}>
                                                            {task.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="font-mono text-sm font-black italic opacity-40">
                                                            {(Number(task.total_active_seconds) / 3600).toFixed(1)}h
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {tasks.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-8 py-20 text-center">
                                                        <Activity className="mx-auto h-10 w-10 opacity-10 mb-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">No production cycles registered for this node.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Card>
                            </TabsContent>

                            <TabsContent value="financials" className="mt-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="rounded-[32px] border-border/40 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accounts Receivable</h3>
                                            <DollarSign className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-4xl font-black tracking-tighter">${project.invoice_amount?.toLocaleString()}</p>
                                            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                <span>Total Contract Value</span>
                                                <Badge className="bg-blue-50 text-blue-600 border-none font-black">Deposit Recieved: ${project.deposit_amount?.toLocaleString()}</Badge>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="rounded-[32px] border-border/40 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Production Burn</h3>
                                            <TrendingUp className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-4xl font-black tracking-tighter">${stats.burnRate}<span className="text-xl opacity-30">/hr</span></p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Real-time Efficiency Index</p>
                                        </div>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* PROJECT HEALTH PULSE */}
                        <Card className="rounded-[40px] border-border/40 p-10 space-y-10 shadow-2xl bg-white sticky top-32">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Operational Pulse</h4>
                                <h3 className="text-3xl font-black tracking-tighter uppercase">Project Integrity</h3>
                            </div>

                            <div className="space-y-6">
                                <PulseItem icon={Activity} label="Active Cycles" value={tasks.filter(t => t.timer_state === 'running').length.toString()} color="text-primary" />
                                <PulseItem icon={Clock} label="Accumulated Effort" value={`${stats.totalHours}h`} />
                                <PulseItem icon={CheckCircle2} label="Milestones Met" value={`${tasks.filter(t => t.status === 'completed').length}/${tasks.length}`} />
                                <PulseItem icon={AlertTriangle} label="Risk Profile" value="Ultra Low" color="text-green-500" />
                            </div>

                            <div className="pt-8 border-t border-divider/5 space-y-4">
                                <Button className="w-full h-14 rounded-2xl bg-[#111] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest shadow-2xl">
                                    Initiate Quality Audit
                                </Button>
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-divider/10 font-black uppercase text-[10px] tracking-widest hover:bg-muted">
                                    Open Portal Communication
                                </Button>
                            </div>

                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">Governance Node</p>
                                    <p className="text-[10px] text-blue-600/70 font-medium leading-relaxed">
                                        All project telemetry is encrypted and logged for institutional oversight.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const PulseItem = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
        </div>
        <p className={cn("text-lg font-black tracking-tight", color || "text-foreground")}>{value}</p>
    </div>
);

export default ProjectInternal;
