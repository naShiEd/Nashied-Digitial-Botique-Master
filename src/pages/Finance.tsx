
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
    FileText,
    Download,
    Eye,
    Receipt,
    Calendar,
    DollarSign,
    RefreshCcw,
    Send,
    Banknote,
    Link,
    ExternalLink
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

import { InvoiceTemplate } from "@/components/finance/InvoiceTemplate";

const SalesHub = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Creation State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'invoice' | 'quote'>('invoice');
    const [newTransaction, setNewTransaction] = useState({
        client_id: '',
        project_id: '',
        due_date: '',
        total_amount: 0,
        notes: '',
        items: [{ description: '', quantity: 1, rate: 0 }]
    });

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [selectedInvoiceItems, setSelectedInvoiceItems] = useState<any[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [orgProfile, setOrgProfile] = useState<any>(null);
    const { profile } = useAuth();
    const { toast } = useToast();

    // Stats Logic
    const stats = useMemo(() => ({
        pendingInvoices: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length,
        revenuePotential: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_amount || 0), 0),
        totalReceivables: invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + (i.total_amount - (i.amount_paid || 0)), 0),
    }), [invoices, quotes]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchInvoices(),
            fetchQuotes(),
            fetchClients(),
            fetchProjects(),
            fetchOrgProfile()
        ]);
        setLoading(false);
    };

    const fetchOrgProfile = async () => {
        const { data } = await supabase.from('organization_profile').select('*').maybeSingle();
        if (data) setOrgProfile(data);
    };

    const fetchInvoices = async () => {
        const { data } = await supabase
            .from('invoices')
            .select('*, client:clients(company_name), project:projects(name)')
            .order('created_at', { ascending: false });
        setInvoices(data || []);
    };

    const fetchQuotes = async () => {
        const { data } = await supabase
            .from('quotes')
            .select('*, client:clients(company_name), project:projects(name)')
            .order('created_at', { ascending: false });
        setQuotes(data || []);
    };

    const fetchClients = async () => {
        const { data } = await supabase.from('clients').select('id, company_name');
        setClients(data || []);
    };

    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('id, name').eq('status', 'Active');
        setProjects(data || []);
    };

    const handleCreateTransaction = async () => {
        try {
            const table = transactionType === 'invoice' ? 'invoices' : 'quotes';
            const { data, error } = await supabase
                .from(table)
                .insert([{
                    client_id: newTransaction.client_id,
                    project_id: newTransaction.project_id || null,
                    total_amount: newTransaction.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0),
                    due_date: newTransaction.due_date,
                    notes: newTransaction.notes,
                    status: 'draft'
                }])
                .select()
                .single();

            if (error) throw error;

            if (transactionType === 'invoice' && data) {
                const lineItems = newTransaction.items.map(item => ({
                    invoice_id: data.id,
                    description: item.description,
                    quantity: item.quantity,
                    rate: item.rate
                }));
                const { error: itemError } = await supabase.from('invoice_items').insert(lineItems);
                if (itemError) throw itemError;
            }

            toast({ title: "Success", description: `${transactionType} created successfully` });
            setIsCreateDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleViewInvoice = async (invoice: any) => {
        setLoading(true);
        const { data: items } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoice.id);

        setSelectedInvoice(invoice);
        setSelectedInvoiceItems(items || []);
        setIsPreviewOpen(true);
        setLoading(false);
    };

    const handleCopyPortalLink = (type: 'invoice' | 'quote', id: string) => {
        const link = `${window.location.origin}/portal/${type}/${id}`;
        navigator.clipboard.writeText(link);
        toast({ title: "Portal Link Copied", description: "Secure access URL has been copied to your clipboard." });
    };

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-render-target');
        if (!printContent) return;

        const win = window.open('', '_blank');
        if (!win) return;

        win.document.write(`
            <html>
                <head>
                    <title>Invoice_${selectedInvoice?.invoice_number}</title>
                    <link rel="stylesheet" href="${window.location.origin}/index.css">
                    <style>
                        body { background: white !important; -webkit-print-color-adjust: exact; }
                        #invoice-render-target { box-shadow: none !important; border: none !important; width: 100% !important; max-width: none !important; }
                        @page { margin: 0; size: auto; }
                        .print-hidden { display: none !important; }
                    </style>
                </head>
                <body onload="window.print();window.close()">
                    ${printContent.outerHTML}
                </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <DashboardLayout headerTitle="Sales & Revenue Hub">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* 1️⃣ REVENUE SNAPSHOT (STATIC COUNTERS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Pending Receivables</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">${stats.totalReceivables.toLocaleString()}</h3>
                                    <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> {stats.pendingInvoices} Overdue / Unpaid
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                    <Receipt className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Revenue Potential</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">${stats.revenuePotential.toLocaleString()}</h3>
                                    <p className="text-xs text-green-500 font-bold mt-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> From Accepted Quotes
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                    <ArrowUpRight className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Active Quotes</p>
                                    <h3 className="text-3xl font-bold font-display text-foreground tabular-nums">{quotes.filter(q => q.status === 'sent').length}</h3>
                                    <p className="text-xs text-blue-500 font-bold mt-1">Awaiting Client Response</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2️⃣ MAIN HUB TABS */}
                <Tabs defaultValue="invoices" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
                            <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Invoices</TabsTrigger>
                            <TabsTrigger value="quotes" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20 px-6 font-bold uppercase tracking-widest text-[10px]">Quotes</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest border-border/50">
                                <Download className="mr-2 h-3.5 w-3.5" /> Export PDF
                            </Button>
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary">
                                        <Plus className="mr-2 h-3.5 w-3.5" /> New
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-card border-border shadow-2xl rounded-2xl p-0 overflow-hidden">
                                    <DialogHeader className="p-6 bg-muted/30 border-b border-border/50">
                                        <DialogTitle className="text-xl font-bold uppercase tracking-tighter">Create New {transactionType}</DialogTitle>
                                    </DialogHeader>
                                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Type</Label>
                                                <Select value={transactionType} onValueChange={(val: any) => setTransactionType(val)}>
                                                    <SelectTrigger className="rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl"><SelectItem value="invoice">Invoice</SelectItem><SelectItem value="quote">Quote</SelectItem></SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Client</Label>
                                                <Select value={newTransaction.client_id} onValueChange={(val) => setNewTransaction({ ...newTransaction, client_id: val })}>
                                                    <SelectTrigger className="rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder="Select Client" /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Project (Optional)</Label>
                                                <Select value={newTransaction.project_id} onValueChange={(val) => setNewTransaction({ ...newTransaction, project_id: val })}>
                                                    <SelectTrigger className="rounded-xl bg-muted/50 border-border/50"><SelectValue placeholder="Select Project" /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Due Date</Label>
                                                <Input type="date" value={newTransaction.due_date} onChange={(e) => setNewTransaction({ ...newTransaction, due_date: e.target.value })} className="rounded-xl bg-muted/50 border-border/50 px-4" />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-[10px] uppercase font-bold text-primary tracking-widest">Line Items</Label>
                                                <Button size="sm" variant="ghost" onClick={() => setNewTransaction({ ...newTransaction, items: [...newTransaction.items, { description: '', quantity: 1, rate: 0 }] })} className="h-6 text-[9px] font-bold uppercase text-primary bg-primary/10 rounded-full px-3">Add Item</Button>
                                            </div>
                                            {newTransaction.items.map((item, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-muted/20 p-3 rounded-xl border border-border/30">
                                                    <div className="col-span-6 space-y-1">
                                                        <Input placeholder="Description" value={item.description} onChange={(e) => {
                                                            const items = [...newTransaction.items];
                                                            items[idx].description = e.target.value;
                                                            setNewTransaction({ ...newTransaction, items });
                                                        }} className="rounded-lg h-8 text-xs bg-card" />
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => {
                                                            const items = [...newTransaction.items];
                                                            items[idx].quantity = parseFloat(e.target.value);
                                                            setNewTransaction({ ...newTransaction, items });
                                                        }} className="rounded-lg h-8 text-xs bg-card px-2" />
                                                    </div>
                                                    <div className="col-span-3 space-y-1">
                                                        <Input type="number" placeholder="Rate" value={item.rate} onChange={(e) => {
                                                            const items = [...newTransaction.items];
                                                            items[idx].rate = parseFloat(e.target.value);
                                                            setNewTransaction({ ...newTransaction, items });
                                                        }} className="rounded-lg h-8 text-xs bg-card px-2" />
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-end h-8">
                                                        <Button variant="ghost" onClick={() => {
                                                            const items = newTransaction.items.filter((_, i) => i !== idx);
                                                            setNewTransaction({ ...newTransaction, items });
                                                        }} className="h-6 w-6 p-0 text-red-500 hover:bg-red-500/10">×</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end gap-3">
                                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl font-bold text-[10px] uppercase border-border/50">Cancel</Button>
                                        <Button onClick={handleCreateTransaction} className="rounded-xl font-bold text-[10px] uppercase bg-primary px-8">Process {transactionType}</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* INVOICES TAB */}
                    <TabsContent value="invoices" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl shadow-primary/5">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                                        <th className="px-6 py-5 w-10"><Input type="checkbox" className="h-3.5 w-3.5 rounded border-border/50" /></th>
                                        <th className="px-4 py-5 font-bold">Date</th>
                                        <th className="px-4 py-5">Invoice#</th>
                                        <th className="px-4 py-5">Project</th>
                                        <th className="px-4 py-5">Customer Name</th>
                                        <th className="px-4 py-5">Status</th>
                                        <th className="px-4 py-5">Due Date</th>
                                        <th className="px-4 py-5 text-right">Amount</th>
                                        <th className="px-4 py-5 text-right">Balance Due</th>
                                        <th className="px-6 py-5 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {invoices.map((inv) => {
                                        const isOverdue = inv.status !== 'paid' && new Date(inv.due_date) < new Date();
                                        const overdueDays = isOverdue ? Math.floor((new Date().getTime() - new Date(inv.due_date).getTime()) / (1000 * 3600 * 24)) : 0;

                                        return (
                                            <tr key={inv.id} className="group hover:bg-muted/40 transition-all duration-200">
                                                <td className="px-6 py-4"><Input type="checkbox" className="h-3.5 w-3.5 rounded border-border/50" /></td>
                                                <td className="px-4 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    {new Date(inv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="font-bold font-mono text-xs text-primary group-hover:underline cursor-pointer" onClick={() => handleViewInvoice(inv)}>
                                                        NASH-{inv.invoice_number || inv.id.slice(0, 5).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-[10px] font-bold uppercase text-muted-foreground/50 tracking-tighter">
                                                    {inv.project?.name || '---'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="font-bold text-xs uppercase tracking-tight text-foreground">{inv.client?.company_name}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {isOverdue ? (
                                                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-500/5 px-2 py-1 rounded-full border border-red-500/10">
                                                            OVERDUE BY {overdueDays} DAYS
                                                        </span>
                                                    ) : (
                                                        <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-3",
                                                            inv.status === 'paid' ? "bg-green-500 text-white border-none shadow-sm" :
                                                                "bg-muted text-muted-foreground"
                                                        )}>
                                                            {inv.status}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-[11px] font-bold text-muted-foreground/80">
                                                    {new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-xs">
                                                    ${inv.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold text-xs text-foreground/80">
                                                    ${(inv.total_amount - (inv.amount_paid || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-muted/30 hover:bg-primary hover:text-white transition-all">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                                                                <DropdownMenuItem onClick={() => handleViewInvoice(inv)} className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                                                                    <Eye className="h-3.5 w-3.5 text-blue-500" /> View / Preview
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                                                                    <Download className="h-3.5 w-3.5 text-orange-500" /> Download PDF
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                                                                    <Send className="h-3.5 w-3.5 text-green-500" /> Send via Email
                                                                </DropdownMenuItem>
                                                                <div className="h-px bg-border/30 my-1 mx-2" />
                                                                <DropdownMenuItem className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer bg-primary/5 text-primary">
                                                                    <Banknote className="h-3.5 w-3.5" /> Record Payment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleCopyPortalLink('invoice', inv.id)} className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer text-blue-600">
                                                                    <Link className="h-3.5 w-3.5" /> Share Portal Link
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => window.open(`/portal/invoice/${inv.id}`, '_blank')} className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                                                                    <ExternalLink className="h-3.5 w-3.5" /> Open Public Portal
                                                                </DropdownMenuItem>
                                                                <div className="h-px bg-border/30 my-1 mx-2" />
                                                                <DropdownMenuItem className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-destructive cursor-pointer hover:bg-destructive/10">
                                                                    <AlertTriangle className="h-3.5 w-3.5" /> Cancel Invoice
                                                                </DropdownMenuItem>
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
                    </TabsContent>

                    {/* QUOTES TAB */}
                    <TabsContent value="quotes" className="mt-0 space-y-4">
                        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/30 border-b border-border/50">
                                    <tr className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <th className="px-6 py-4">Quote #</th>
                                        <th className="px-6 py-4">Client / Project</th>
                                        <th className="px-6 py-4">Expiry Date</th>
                                        <th className="px-6 py-4">Value (USD)</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {quotes.map((quote) => (
                                        <tr key={quote.id} className="group hover:bg-muted/20 transition-all">
                                            <td className="px-6 py-4 font-bold font-mono text-sm">
                                                QUO-{quote.quote_number || quote.id.slice(0, 5).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-sm text-foreground">{quote.client?.company_name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-medium">{quote.project?.name || 'Service Prospect'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" /> {quote.expiry_date ? new Date(quote.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No Expiry'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm">${quote.total_amount.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-3",
                                                    quote.status === 'accepted' ? "bg-green-500 text-white" :
                                                        quote.status === 'draft' ? "bg-muted text-muted-foreground border border-border" :
                                                            quote.status === 'declined' ? "bg-red-500/10 text-red-600 border border-red-500/20" : "bg-blue-500 text-white"
                                                )}>
                                                    {quote.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"><CheckCircle2 className="h-4 w-4" /></Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 shadow-2xl backdrop-blur-xl">
                                                            <DropdownMenuItem onClick={() => handleCopyPortalLink('quote', quote.id)} className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer text-blue-600">
                                                                <Link className="h-3.5 w-3.5" /> Share Portal Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => window.open(`/portal/quote/${quote.id}`, '_blank')} className="gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                                                                <ExternalLink className="h-3.5 w-3.5" /> View Public Portal
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-border/30 my-1 mx-2" />
                                                            <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-widest py-2.5 rounded-xl"><ArrowUpRight className="h-4 w-4 text-blue-500" /> Convert to Invoice</DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-widest py-2.5 rounded-xl"><RefreshCcw className="h-4 w-4 text-orange-500" /> Re-open Draft</DropdownMenuItem>
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
                </Tabs>
            </div>

            {/* INVOICE PREVIEW DIALOG */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-[850px] p-0 overflow-hidden bg-muted border-none shadow-2xl">
                    <div className="max-h-[85vh] overflow-y-auto p-8 bg-muted pt-16">
                        {selectedInvoice && (
                            <InvoiceTemplate
                                invoiceNumber={selectedInvoice.invoice_number || selectedInvoice.id.slice(0, 5).toUpperCase()}
                                date={new Date(selectedInvoice.created_at)}
                                dueDate={new Date(selectedInvoice.due_date)}
                                terms="Due on Receipt"
                                clientName={selectedInvoice.client?.company_name || "Unknown Client"}
                                subject={selectedInvoice.project?.name + " - Standard Package"}
                                items={selectedInvoiceItems.length > 0 ? selectedInvoiceItems : [
                                    {
                                        description: "Project Development & Production\nCustom software/creative production services including strategy and rollout.",
                                        quantity: 1,
                                        rate: selectedInvoice.total_amount,
                                        amount: selectedInvoice.total_amount
                                    }
                                ]}
                                subtotal={selectedInvoice.total_amount}
                                total={selectedInvoice.total_amount}
                                balanceDue={selectedInvoice.total_amount - (selectedInvoice.amount_paid || 0)}
                                notes="Thanks for your business."
                                orgProfile={orgProfile}
                            />
                        )}
                        <div className="mt-8 flex justify-center gap-4 no-print">
                            <Button className="bg-primary px-8 rounded-xl font-bold uppercase tracking-widest" onClick={handlePrint}>
                                <Download className="mr-2 h-4 w-4" /> Print / Save PDF
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default SalesHub;

