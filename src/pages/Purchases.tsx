
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    AlertTriangle,
    MoreHorizontal,
    FileText,
    Download,
    Eye,
    Receipt,
    Calendar,
    DollarSign,
    RefreshCcw,
    Send,
    Truck,
    CreditCard,
    ShoppingBag
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

const PurchasesHub = () => {
    const [bills, setBills] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Stats Logic
    const stats = useMemo(() => ({
        pendingBills: bills.filter(b => b.status === 'pending' || b.status === 'overdue').length,
        totalPayables: bills.filter(b => b.status !== 'paid' && b.status !== 'cancelled').reduce((sum, b) => sum + (b.total_amount - (b.amount_paid || 0)), 0),
        activeVendors: vendors.filter(v => v.status === 'active').length
    }), [bills, vendors]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchBills(),
            fetchVendors()
        ]);
        setLoading(false);
    };

    const fetchBills = async () => {
        const { data } = await supabase
            .from('bills')
            .select('*, vendor:vendors(company_name)')
            .order('created_at', { ascending: false });
        setBills(data || []);
    };

    const fetchVendors = async () => {
        const { data } = await supabase
            .from('vendors')
            .select('*')
            .order('company_name', { ascending: true });
        setVendors(data || []);
    };

    return (
        <DashboardLayout headerTitle="Purchases & Payables">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* 1️⃣ PAYABLES SNAPSHOT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Total Payables</p>
                                    <h3 className="text-3xl font-black font-display text-foreground tabular-nums">${stats.totalPayables.toLocaleString()}</h3>
                                    <p className="text-xs text-orange-500 font-bold mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> {stats.pendingBills} Bills Awaiting Payment
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Active Vendors</p>
                                    <h3 className="text-3xl font-black font-display text-foreground tabular-nums">{stats.activeVendors}</h3>
                                    <p className="text-xs text-blue-500 font-bold mt-1">Verified Supply Chain</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Truck className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Monthly Spend (Est)</p>
                                    <h3 className="text-3xl font-black font-display text-foreground tabular-nums">${(stats.totalPayables * 0.8).toLocaleString()}</h3>
                                    <p className="text-xs text-muted-foreground font-bold mt-1">Projected Operating Expenses</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2️⃣ MAIN HUB TABS */}
                <Tabs defaultValue="bills" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
                            <TabsTrigger value="bills" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Bills & Invoices</TabsTrigger>
                            <TabsTrigger value="vendors" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Vendors</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            <Button size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary">
                                <Plus className="mr-2 h-3.5 w-3.5" /> Log Expenditure
                            </Button>
                        </div>
                    </div>

                    {/* BILLS TAB */}
                    <TabsContent value="bills" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                        <th className="px-6 py-4">Bill #</th>
                                        <th className="px-6 py-4">Vendor / Supplier</th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4">Amount (USD)</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {bills.map((bill) => (
                                        <tr key={bill.id} className="group hover:bg-muted/20 transition-all">
                                            <td className="px-6 py-4 font-black font-mono text-sm">
                                                BIL-{bill.bill_number || bill.id.slice(0, 5).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm text-foreground">{bill.vendor?.company_name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-medium">Operating Supply</p>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" /> {bill.due_date ? new Date(bill.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-black text-sm">${bill.total_amount.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-full px-3",
                                                    bill.status === 'paid' ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                                                        bill.status === 'pending' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" :
                                                            bill.status === 'overdue' ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {bill.status}
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
                                                            <DropdownMenuItem className="gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-green-500" /> Record Payment</DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-bold text-destructive"><AlertTriangle className="h-4 w-4" /> Void Bill</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>

                    {/* VENDORS TAB */}
                    <TabsContent value="vendors" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                                        <th className="px-6 py-4">Vendor Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {vendors.map((vendor) => (
                                        <tr key={vendor.id} className="group hover:bg-muted/20 transition-all">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm text-foreground">{vendor.company_name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{vendor.category || 'Standard'}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                                                {vendor.contact_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-full px-3",
                                                    vendor.status === 'active' ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {vendor.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><Eye className="h-4 w-4" /></Button>
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

export default PurchasesHub;
