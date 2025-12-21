import { useEffect, useState, useMemo, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Clock,
    Users,
    Zap,
    ZapOff,
    RefreshCcw,
    ChevronRight,
    FileText,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    Play,
    Pause,
    Square,
    MoreHorizontal,
    AlertTriangle,
    Repeat,
    Target,
    Briefcase,
    Activity,
    Timer,
    CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Taskmaster = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { user, profile } = useAuth();
    const { toast } = useToast();

    // Timer state (Local side simulation for UI snappiness)
    const [runningTimers, setRunningTimers] = useState<Record<string, number>>({});
    const timerRef = useRef<any>(null);

    // New Task State
    const [newTask, setNewTask] = useState({
        title: '',
        project_id: '',
        priority: 'medium',
        task_category: 'one-off',
        due_date: ''
    });

    useEffect(() => {
        if (profile) {
            fetchTasks();
            fetchProjects();
        }
    }, [profile]);

    useEffect(() => {
        // Simple timer loop
        timerRef.current = setInterval(() => {
            setRunningTimers(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(id => {
                    updated[id] += 1;
                });
                return updated;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('id, name').eq('status', 'Active');
        setProjects(data || []);
    };

    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*, projects!inner(name, status, client:clients(company_name)), owner:profiles!assigned_to(full_name, avatar_url)')
            .eq('projects.status', 'Active')
            .order('created_at', { ascending: false });

        if (error) console.error(error);
        else {
            setTasks(data || []);
            // Sync running timers from DB if needed (simplified for now)
            const active = data?.filter(t => t.timer_state === 'running') || [];
            const timers: Record<string, number> = {};
            active.forEach(t => {
                timers[t.id] = Number(t.total_active_seconds || 0);
            });
            setRunningTimers(timers);
        }
        setLoading(false);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('tasks').insert([{
                ...newTask,
                assigned_to: user?.id,
                status: 'pending'
            }]);
            if (error) throw error;
            toast({ title: "Task Deployed", description: "Production queue has been updated." });
            setIsCreateOpen(false);
            fetchTasks();
        } catch (error: any) {
            toast({ title: "Deployment Error", description: error.message, variant: "destructive" });
        }
    };

    const toggleTimer = async (taskId: string, currentState: string) => {
        const newState = currentState === 'running' ? 'stopped' : 'running';
        try {
            const { error } = await supabase.from('tasks').update({
                timer_state: newState,
                // In a real app we'd calculate duration on stop
            }).eq('id', taskId);

            if (error) throw error;

            if (newState === 'running') {
                setRunningTimers(prev => ({ ...prev, [taskId]: tasks.find(t => t.id === taskId)?.total_active_seconds || 0 }));
            } else {
                setRunningTimers(prev => {
                    const next = { ...prev };
                    delete next[taskId];
                    return next;
                });
            }
            fetchTasks();
        } catch (error: any) {
            toast({ title: "Timer Failure", description: error.message, variant: "destructive" });
        }
    };

    const updateTaskStatus = async (taskId: string, status: string) => {
        try {
            const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
            if (error) throw error;
            toast({ title: "Momentum Conserved", description: `Task status migrated to ${status}.` });
            fetchTasks();
        } catch (error: any) {
            toast({ title: "Sync Error", description: error.message, variant: "destructive" });
        }
    };

    const stats = useMemo(() => ({
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.timer_state === 'running').length,
        review: tasks.filter(t => t.status === 'review').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    }), [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.projects?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.projects?.client?.company_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = activeFilters.includes("All") || activeFilters.includes(task.status);
            return matchesSearch && matchesFilter;
        });
    }, [tasks, searchQuery, activeFilters]);

    const groupedTasks = useMemo(() => {
        const groups: Record<string, any> = {};
        filteredTasks.forEach(task => {
            const pId = task.project_id || 'internal';
            if (!groups[pId]) {
                groups[pId] = {
                    name: task.projects?.name || 'Internal Operations',
                    client: task.projects?.client?.company_name || 'Agency Root',
                    tasks: []
                };
            }
            groups[pId].tasks.push(task);
        });
        return groups;
    }, [filteredTasks]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <DashboardLayout headerTitle="Production Command">
            <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">

                {/* 1️⃣ KPI DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <ProductionStat label="Production Queue" count={stats.pending} color="text-gray-400" icon={Activity} />
                    <ProductionStat label="Deep Work (Active)" count={stats.inProgress} color="text-primary" icon={Timer} active={stats.inProgress > 0} />
                    <ProductionStat label="Quality Assurance" count={stats.review} color="text-orange-500" icon={Zap} />
                    <ProductionStat label="Deliverables Closed" count={stats.completed} color="text-green-500" icon={CheckCircle2} />
                </div>

                {/* 2️⃣ COMMAND CONTROLS */}
                <div className="flex flex-col lg:flex-row justify-between items-center bg-card p-6 rounded-[32px] border border-border/50 shadow-xl gap-6">
                    <div className="relative flex-1 w-full lg:max-w-2xl">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-40" />
                        <Input
                            placeholder="Search by Client, Project, or Objective..."
                            className="bg-muted/10 h-16 pl-14 rounded-2xl border-border/50 text-lg font-bold focus-visible:ring-primary/20 transition-all focus:bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-16 px-10 rounded-[20px] font-bold uppercase text-[11px] tracking-widest shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95">
                                    <Plus className="mr-2 h-5 w-5" /> Deploy Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg rounded-[40px] border-none shadow-2xl p-8">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-bold uppercase tracking-tighter">Task Deployment</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateTask} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Project Link</Label>
                                        <Select onValueChange={(v) => setNewTask({ ...newTask, project_id: v })} required>
                                            <SelectTrigger className="h-14 rounded-2xl"><SelectValue placeholder="Select Parent Project" /></SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                {projects.map(p => <SelectItem key={p.id} value={p.id} className="font-bold text-[11px] uppercase">{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Task Specification</Label>
                                        <Input required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Identity Design Sprint Phase 1" className="h-14 rounded-2xl font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Priority</Label>
                                            <Select onValueChange={(v) => setNewTask({ ...newTask, priority: v })} defaultValue="medium">
                                                <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="urgent">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Deadline Point</Label>
                                            <Input type="date" value={newTask.due_date} onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })} className="h-12 rounded-xl" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-16 rounded-[24px] font-bold uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 mt-4">Commit to Pipeline</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* 3️⃣ PRODUCTION BOARD */}
                <div className="grid grid-cols-1 gap-10">
                    {Object.entries(groupedTasks).map(([pId, group]: any) => (
                        <div key={pId} className="space-y-4 group">
                            <div className="flex items-end justify-between px-2">
                                <div className="space-y-0.5">
                                    <h3 className="text-2xl font-bold tracking-tighter uppercase text-foreground">{group.client} <span className="text-primary opacity-40 mx-2">—</span> {group.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Project Command Node</p>
                                </div>
                                <div className="h-px flex-1 mx-8 bg-divider/10 mb-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Badge variant="outline" className="h-8 rounded-xl px-4 font-bold text-[9px] uppercase tracking-widest border-divider/10 bg-muted/20">
                                    {group.tasks.length} Deliverables
                                </Badge>
                            </div>

                            <Card className="border-border/40 shadow-2xl rounded-[40px] overflow-hidden bg-white/50 backdrop-blur-xl border-none ring-1 ring-black/5">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#111] text-white">
                                        <tr className="text-[10px] uppercase tracking-[0.2em] font-bold">
                                            <th className="px-8 py-5">Task Architecture</th>
                                            <th className="px-8 py-5">Assigned</th>
                                            <th className="px-8 py-5 text-center">Status</th>
                                            <th className="px-8 py-5">Production Timer</th>
                                            <th className="px-8 py-5 text-right">Momentum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-divider/5">
                                        {group.tasks.map((task: any) => (
                                            <tr key={task.id} className={cn(
                                                "group transition-all hover:bg-white",
                                                task.timer_state === 'running' && "bg-primary/[0.04] ring-1 ring-primary/20"
                                            )}>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1.5">
                                                        <div className="font-bold text-sm uppercase tracking-tight text-foreground">{task.title}</div>
                                                        <div className="flex gap-2">
                                                            <Badge className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0 border-none",
                                                                task.priority === 'urgent' ? 'bg-red-500 text-white' :
                                                                    task.priority === 'high' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
                                                            )}>
                                                                {task.priority || 'NORMAL'}
                                                            </Badge>
                                                            {task.task_category === 'monthly' && (
                                                                <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0 rounded flex items-center gap-1">
                                                                    <Repeat className="h-2 w-2" /> RETAINER
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 shadow-sm">
                                                            {task.owner?.full_name?.charAt(0) || "U"}
                                                        </div>
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">{task.owner?.full_name?.split(' ')[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <Badge className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-4 py-1",
                                                        task.status === 'completed' ? "bg-green-500 text-white" :
                                                            task.status === 'review' ? "bg-orange-500 text-white" :
                                                                task.status === 'in_progress' || task.timer_state === 'running' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                                    )}>
                                                        {task.timer_state === 'running' ? 'ACTIVE' : task.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex gap-2 bg-muted/30 p-2 rounded-2xl border border-divider/10">
                                                            <button
                                                                onClick={() => toggleTimer(task.id, task.timer_state)}
                                                                className={cn(
                                                                    "h-9 w-9 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90",
                                                                    task.timer_state === 'running' ? "bg-red-500 text-white shadow-red-500/20" : "bg-green-500 text-white shadow-green-500/20"
                                                                )}
                                                            >
                                                                {task.timer_state === 'running' ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
                                                            </button>
                                                        </div>
                                                        <div className={cn(
                                                            "font-mono text-xl font-bold tabular-nums tracking-tighter",
                                                            task.timer_state === 'running' ? "text-primary scale-110 origin-left transition-transform" : "text-muted-foreground/30"
                                                        )}>
                                                            {formatTime(runningTimers[task.id] || task.total_active_seconds || 0)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted"><MoreHorizontal className="h-5 w-5" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2 border-divider/10 shadow-2xl">
                                                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'review')} className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-3 p-3 text-orange-600"><Zap className="h-4 w-4" /> Ship for Review</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'completed')} className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-3 p-3 text-green-600"><CheckCircle2 className="h-4 w-4" /> Move to Closed</DropdownMenuItem>
                                                                <div className="h-px bg-divider/10 my-2" />
                                                                <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-3 p-3"><FileText className="h-4 w-4" /> Attach Deliverables</DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-xl font-bold uppercase text-[10px] tracking-tight gap-3 p-3 text-destructive"><Trash2 className="h-4 w-4" /> Purge Task</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

const ProductionStat = ({ label, count, color, icon: Icon, active }: any) => (
    <Card className={cn(
        "bg-card border-border/40 shadow-2xl rounded-[32px] overflow-hidden group transition-all",
        active && "ring-2 ring-primary bg-primary/[0.02]"
    )}>
        <CardContent className="p-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] opacity-60">{label}</p>
                    <h3 className={cn("text-4xl font-bold font-display tracking-tighter tabular-nums", color)}>{count}</h3>
                </div>
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12",
                    active ? "bg-primary text-white animate-pulse shadow-lg shadow-primary/20" : "bg-muted/30 text-muted-foreground opacity-40"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const Trash2 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

export default Taskmaster;
