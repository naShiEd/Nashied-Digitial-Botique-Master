
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    MoreHorizontal,
    FileText,
    Download,
    Eye,
    Calendar,
    DollarSign,
    RefreshCcw,
    Users,
    Briefcase,
    Banknote,
    History
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const PayrollHub = () => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [payrollRuns, setPayrollRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Stats Logic
    const stats = useMemo(() => ({
        activeEmployees: employees.filter(e => e.status === 'active').length,
        lastMonthGross: payrollRuns[0]?.total_gross || 0,
        pendingRuns: payrollRuns.filter(r => r.status === 'draft').length
    }), [employees, payrollRuns]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchEmployees(),
            fetchPayrollRuns()
        ]);
        setLoading(false);
    };

    const fetchEmployees = async () => {
        const { data } = await supabase
            .from('employees')
            .select('*, profile:profiles(full_name, email)')
            .order('created_at', { ascending: false });
        setEmployees(data || []);
    };

    const fetchPayrollRuns = async () => {
        const { data } = await supabase
            .from('payroll_runs')
            .select('*')
            .order('year', { ascending: false })
            .order('month', { ascending: false });
        setPayrollRuns(data || []);
    };

    return (
        <DashboardLayout headerTitle="Payroll & HR Hub">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* 1️⃣ HR SNAPSHOT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Active Staff</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">{stats.activeEmployees}</h3>
                                    <p className="text-xs text-blue-500 font-bold mt-1">Full-time & Contract</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Monthly Payroll Cost</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">${stats.lastMonthGross.toLocaleString()}</h3>
                                    <p className="text-xs text-green-500 font-bold mt-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Last Run Total
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                    <Banknote className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Pending Runs</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">{stats.pendingRuns}</h3>
                                    <p className="text-xs text-orange-500 font-bold mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Requires Approval
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                    <RefreshCcw className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2️⃣ MAIN HUB TABS */}
                <Tabs defaultValue="runs" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
                            <TabsTrigger value="runs" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Monthly Runs</TabsTrigger>
                            <TabsTrigger value="employees" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Employee List</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            <Button size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary">
                                <Plus className="mr-2 h-3.5 w-3.5" /> New Pay Run
                            </Button>
                        </div>
                    </div>

                    {/* PAYROLL RUNS TAB */}
                    <TabsContent value="runs" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <th className="px-6 py-4">Period</th>
                                        <th className="px-6 py-4">Year</th>
                                        <th className="px-6 py-4">Gross Total</th>
                                        <th className="px-6 py-4">Net Total</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {payrollRuns.map((run) => (
                                        <tr key={run.id} className="group hover:bg-muted/20 transition-all">
                                            <td className="px-6 py-4 font-bold text-sm uppercase">
                                                {run.month}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                                                {run.year}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm">${run.total_gross.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm text-green-600">${run.total_net.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-3",
                                                    run.status === 'paid' ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                                                        run.status === 'processed' ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {run.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem className="gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-green-500" /> Mark as Paid</DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-bold"><Download className="h-4 w-4 text-blue-500" /> Export Payslips</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {payrollRuns.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                <History className="mx-auto h-8 w-8 opacity-20 mb-4" />
                                                <p className="text-xs font-bold uppercase tracking-widest">No payroll history found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    {/* EMPLOYEES TAB */}
                    <TabsContent value="employees" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">Job Title</th>
                                        <th className="px-6 py-4">Basic Salary</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className="group hover:bg-muted/20 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                        {emp.profile?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground">{emp.profile?.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{emp.employee_number || 'STF-001'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">{emp.job_title || 'Unassigned'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm">${emp.basic_salary.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-3",
                                                    emp.status === 'active' ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {emp.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><Download className="h-4 w-4" /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default PayrollHub;
