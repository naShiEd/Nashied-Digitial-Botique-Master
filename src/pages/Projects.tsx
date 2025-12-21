
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    MoreHorizontal,
    User,
    Calendar,
    DollarSign,
    Lock,
    Play,
    Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Projects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isInitOpen, setIsInitOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const { profile } = useAuth();
    const { toast } = useToast();

    // Form State
    const [newProject, setNewProject] = useState({
        name: '',
        client_id: '',
        start_date: '',
        end_date: '',
        invoice_amount: 0,
        deposit_amount: 0,
        type: 'Campaign'
    });

    const [initData, setInitData] = useState({
        assigned_to: ''
    });

    // Auto-calculated Financials
    const depositCalc = useMemo(() => {
        const amt = newProject.invoice_amount || 0;
        const dep = newProject.deposit_amount || 0;
        const percent = amt > 0 ? (dep / amt) * 100 : 0;
        return {
            percent: percent.toFixed(1),
            isWarning: percent < 50
        };
    }, [newProject.invoice_amount, newProject.deposit_amount]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchProjects(),
            fetchClients(),
            fetchStaff()
        ]);
        setLoading(false);
    };

    const fetchProjects = async () => {
        const { data } = await supabase
            .from('projects')
            .select('*, client:clients(company_name), assigned:profiles!assigned_to(full_name)')
            .order('created_at', { ascending: false });
        setProjects(data || []);
    };

    const fetchClients = async () => {
        const { data } = await supabase.from('clients').select('id, company_name');
        setClients(data || []);
    };

    const fetchStaff = async () => {
        const { data } = await supabase.from('profiles').select('id, full_name, role');
        setStaff(data || []);
    };

    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [fullClientData, setFullClientData] = useState({
        company_name: '',
        customer_type: 'Business' as 'Business' | 'Individual',
        first_name: '',
        last_name: '',
        email: '',
        phone_work: '',
        phone_mobile: '',
        currency: 'USD',
        payment_terms: 'Due on Receipt'
    });

    const handleCreateDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('projects').insert([{
                ...newProject,
                status: 'Draft'
            }]);
            if (error) throw error;
            toast({ title: "Draft Saved", description: "Project added to pipeline." });
            setIsCreateOpen(false);
            fetchProjects();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleAddNewClient = async () => {
        if (!fullClientData.company_name && !fullClientData.first_name) {
            toast({ title: "Error", description: "Company or Contact name is required.", variant: "destructive" });
            return;
        }
        try {
            const { data, error } = await supabase
                .from('clients')
                .insert([fullClientData])
                .select()
                .single();

            if (error) throw error;

            setClients(prev => [...prev, data]);
            setNewProject(prev => ({ ...prev, client_id: data.id }));
            setIsAddClientOpen(false);
            setFullClientData({
                company_name: '',
                customer_type: 'Business',
                first_name: '',
                last_name: '',
                email: '',
                phone_work: '',
                phone_mobile: '',
                currency: 'USD',
                payment_terms: 'Due on Receipt'
            });
            toast({ title: "Client Master Created", description: `${data.company_name || data.first_name} has been added and selected.` });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleInitialize = async () => {
        if (!initData.assigned_to) {
            toast({ title: "Required", description: "Responsible person must be assigned.", variant: "destructive" });
            return;
        }
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    status: 'Active',
                    assigned_to: initData.assigned_to
                })
                .eq('id', selectedProject.id);
            if (error) throw error;
            toast({ title: "Project Initialized", description: "Work has officially begun." });
            setIsInitOpen(false);
            fetchProjects();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const updateProjectStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase.from('projects').update({ status }).eq('id', id);
            if (error) throw error;
            toast({ title: "Status Updated", description: `Project is now ${status}.` });
            fetchProjects();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <DashboardLayout headerTitle="Projects Hub">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-display">Project Command</h2>
                    <p className="text-muted-foreground font-medium">Draft, initialize, and track agency builds.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader><DialogTitle className="text-2xl font-display">New Project Draft</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreateDraft} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Project Name</Label>
                                        <Input required value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="e.g. Q1 Content Campaign" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <Label>Client</Label>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddClientOpen(!isAddClientOpen)}
                                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
                                            >
                                                {isAddClientOpen ? "Cancel" : "+ Add New Client"}
                                            </button>
                                        </div>

                                        {isAddClientOpen ? (
                                            <div className="space-y-4 animate-in slide-in-from-top-1 duration-300 bg-primary/5 p-4 rounded-xl border border-primary/20">
                                                <div className="flex items-center gap-4">
                                                    <Label className="text-[10px] font-black uppercase">Type:</Label>
                                                    <div className="flex gap-2">
                                                        {['Business', 'Individual'].map(t => (
                                                            <button
                                                                key={t}
                                                                type="button"
                                                                onClick={() => setFullClientData({ ...fullClientData, customer_type: t as any })}
                                                                className={cn("px-2 py-0.5 rounded text-[10px] font-bold border transition-all",
                                                                    fullClientData.customer_type === t ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border")
                                                                }
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input placeholder="First Name" value={fullClientData.first_name} onChange={(e) => setFullClientData({ ...fullClientData, first_name: e.target.value })} className="h-9 px-3 rounded-lg text-xs focus-visible:ring-primary/20" />
                                                    <Input placeholder="Last Name" value={fullClientData.last_name} onChange={(e) => setFullClientData({ ...fullClientData, last_name: e.target.value })} className="h-9 px-3 rounded-lg text-xs focus-visible:ring-primary/20" />
                                                </div>
                                                <Input placeholder="Company Name" value={fullClientData.company_name} onChange={(e) => setFullClientData({ ...fullClientData, company_name: e.target.value })} className="h-9 px-3 rounded-lg text-xs font-bold focus-visible:ring-primary/20" />
                                                <Input placeholder="Email Address" value={fullClientData.email} onChange={(e) => setFullClientData({ ...fullClientData, email: e.target.value })} className="h-9 px-3 rounded-lg text-xs focus-visible:ring-primary/20" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input placeholder="Work Phone" value={fullClientData.phone_work} onChange={(e) => setFullClientData({ ...fullClientData, phone_work: e.target.value })} className="h-9 px-3 rounded-lg text-xs focus-visible:ring-primary/20" />
                                                    <Input placeholder="Mobile Phone" value={fullClientData.phone_mobile} onChange={(e) => setFullClientData({ ...fullClientData, phone_mobile: e.target.value })} className="h-9 px-3 rounded-lg text-xs focus-visible:ring-primary/20" />
                                                </div>
                                                <div className="flex gap-2 pt-2 border-t border-primary/10">
                                                    <Button type="button" onClick={handleAddNewClient} className="flex-1 h-9 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Register Client Master</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Select value={newProject.client_id} onValueChange={(v) => setNewProject({ ...newProject, client_id: v })} required>
                                                <SelectTrigger><SelectValue placeholder="Select Account" /></SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {clients.map(c => <SelectItem key={c.id} value={c.id} className="text-xs font-bold uppercase tracking-tight">{c.company_name || `${c.first_name} ${c.last_name}`}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input type="date" required value={newProject.start_date} onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Completion Date</Label>
                                            <Input type="date" required value={newProject.end_date} onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Financial Setup</h4>
                                    <div className="space-y-2">
                                        <Label>Invoice Amount (USD)</Label>
                                        <Input type="number" required value={newProject.invoice_amount} onChange={(e) => setNewProject({ ...newProject, invoice_amount: parseFloat(e.target.value) })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deposit Amount (USD)</Label>
                                        <Input type="number" value={newProject.deposit_amount} onChange={(e) => setNewProject({ ...newProject, deposit_amount: parseFloat(e.target.value) })} />
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between items-center text-sm mb-1">
                                            <span className="text-muted-foreground">Deposit Ratio:</span>
                                            <span className={cn("font-bold", depositCalc.isWarning ? "text-orange-600" : "text-green-600")}>{depositCalc.percent}%</span>
                                        </div>
                                        {depositCalc.isWarning && (
                                            <div className="flex items-center gap-1.5 text-[10px] text-orange-600 font-bold bg-orange-50 p-1.5 rounded-lg">
                                                <AlertTriangle className="h-3 w-3" /> DEPOSIT BELOW 50% POLICY
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" className="md:col-span-2 rounded-xl h-12 text-lg">Save Project as Draft</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border/50 animate-in fade-in duration-500">
                        <tr className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                            <th className="px-6 py-4">Project Architecture</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4">Timeline</th>
                            <th className="px-6 py-4">Financials</th>
                            <th className="px-6 py-4">Assigned To</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {projects.map((project) => {
                            const isBelow50 = (project.deposit_amount / (project.invoice_amount || 1)) < 0.5;
                            return (
                                <tr key={project.id} className="group hover:bg-muted/20 transition-all border-none">
                                    <td className="px-6 py-4">
                                        <Link to={`/dashboard/projects/${project.id}`} className="group/name">
                                            <p className="font-bold text-sm text-foreground group-hover/name:text-primary transition-colors">{project.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{project.client?.company_name}</p>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-primary">{project.client?.company_name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge className={cn("text-[10px] font-black uppercase tracking-tighter rounded-full px-3",
                                            project.status === 'Draft' ? "bg-muted text-muted-foreground" :
                                                project.status === 'Active' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" :
                                                    project.status === 'Completed' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {project.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                                                <Calendar className="h-3 w-3" /> {new Date(project.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                                                <CheckCircle2 className="h-3 w-3" /> {new Date(project.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold">${project.invoice_amount?.toLocaleString()}</span>
                                            <div className="flex items-center gap-1 text-[10px] font-bold">
                                                <span className="text-muted-foreground">Dep: ${project.deposit_amount?.toLocaleString()}</span>
                                                {isBelow50 ? <AlertTriangle className="h-2.5 w-2.5 text-orange-500" /> : <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                                {project.assigned?.full_name?.charAt(0) || <Lock className="h-3 w-3" />}
                                            </div>
                                            <span className="text-xs font-medium">{project.assigned?.full_name || "Uninitialized"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {project.status === 'Draft' && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 rounded-lg bg-primary group-hover:bg-primary/90 text-[10px] font-bold"
                                                    onClick={() => { setSelectedProject(project); setIsInitOpen(true); }}
                                                >
                                                    <Play className="h-3 w-3 mr-1" /> Initialize
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={() => updateProjectStatus(project.id, 'Completed')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark as Completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2"
                                                        onClick={() => updateProjectStatus(project.id, 'On Hold')}
                                                    >
                                                        <AlertTriangle className="h-4 w-4 text-orange-500" /> Place on Hold
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={() => updateProjectStatus(project.id, 'Cancelled')}
                                                    >
                                                        <Lock className="h-4 w-4" /> Cancel Project
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-black uppercase text-[10px]"
                                                        asChild
                                                    >
                                                        <Link to={`/dashboard/projects/${project.id}`}>
                                                            <Activity className="h-4 w-4 text-primary" /> Manage Project
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 font-bold"><DollarSign className="h-4 w-4" /> Update Payments</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Initialization Dialog */}
            <Dialog open={isInitOpen} onOpenChange={setIsInitOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-display">Initialize Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <h4 className="font-bold text-sm mb-1">{selectedProject?.name}</h4>
                            <p className="text-xs text-muted-foreground">Client: {selectedProject?.client?.company_name}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">Responsible Person (Assigned To)</Label>
                            <Select onValueChange={(v) => setInitData({ assigned_to: v })}>
                                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Assign personnel responsible..." /></SelectTrigger>
                                <SelectContent>
                                    {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.role})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                            <p className="text-xs text-orange-800 font-medium">
                                <strong>System Note:</strong> Initialization will lock the client and invoice amount. Production timers in Taskmaster will be enabled.
                            </p>
                        </div>
                        <Button className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" onClick={handleInitialize}>
                            Execute Initialization
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default Projects;
