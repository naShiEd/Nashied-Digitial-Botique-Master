import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    ChevronDown,
    Settings,
    Columns,
    RefreshCw,
    Download,
    Upload,
    ArrowUpDown,
    CheckCircle2,
    Eye,
    Edit3,
    Trash2,
    Globe,
    CreditCard,
    MapPin,
    FileText,
    UserCheck
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Client {
    id: string;
    company_name: string;
    display_name?: string;
    salutation?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_work: string;
    phone_mobile?: string;
    website?: string;
    notes?: string;
    opening_balance?: number;
    credit_limit?: number;
    portal_enabled?: boolean;
    customer_type: 'Business' | 'Individual';
    customer_language?: string;
    tax_rate?: string;
    company_id?: string;
    currency: string;
    payment_terms?: string;
    address_billing?: any;
    address_shipping?: any;
    status: 'active' | 'lead' | 'archived';
    receivables?: number;
    created_at: string;
}

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' } | null>(null);

    const initialClientState: Partial<Client> = {
        company_name: '',
        display_name: '',
        salutation: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_work: '',
        phone_mobile: '',
        website: '',
        notes: '',
        opening_balance: 0,
        credit_limit: 0,
        portal_enabled: false,
        customer_type: 'Business',
        customer_language: 'English',
        currency: 'USD',
        payment_terms: 'Due on Receipt',
        status: 'active',
        address_billing: { attention: '', street1: '', street2: '', city: '', state: '', zip: '', country: '', phone: '', fax: '' },
        address_shipping: { attention: '', street1: '', street2: '', city: '', state: '', zip: '', country: '', phone: '', fax: '' }
    };

    const [newClient, setNewClient] = useState<Partial<Client>>(initialClientState);
    const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importLoading, setImportLoading] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportLoading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split('\n').filter(row => row.trim());
                if (rows.length < 2) throw new Error("File is empty or missing headers.");

                const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                const clientsToInsert = rows.slice(1).map(row => {
                    const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    const client: any = { ...initialClientState };

                    headers.forEach((header, index) => {
                        const val = values[index];
                        if (!val) return;

                        // Field Mapping Logic
                        if (header.toLowerCase().includes('company')) client.company_name = val;
                        else if (header.toLowerCase().includes('first')) client.first_name = val;
                        else if (header.toLowerCase().includes('last')) client.last_name = val;
                        else if (header.toLowerCase().includes('display')) client.display_name = val;
                        else if (header.toLowerCase().includes('email')) client.email = val;
                        else if (header.toLowerCase().includes('work')) client.phone_work = val;
                        else if (header.toLowerCase().includes('mobile')) client.phone_mobile = val;
                        else if (header.toLowerCase().includes('website')) client.website = val;
                        else if (header.toLowerCase().includes('currency')) client.currency = val;
                    });

                    // Ensure display name is set
                    if (!client.display_name) {
                        client.display_name = client.company_name || `${client.first_name} ${client.last_name}`.trim();
                    }
                    delete client.receivables; // Remove calculated field
                    return client;
                });

                const { error } = await supabase.from('clients').insert(clientsToInsert);
                if (error) throw error;

                toast({ title: "Import Successful", description: `Synchronized ${clientsToInsert.length} entities into the cluster.` });
                setIsImportOpen(false);
                fetchClients();
            } catch (err: any) {
                toast({ title: "Import Failed", description: err.message, variant: "destructive" });
            } finally {
                setImportLoading(false);
            }
        };
        reader.readAsText(file);
    };

    const fetchClients = async () => {
        try {
            setLoading(true);
            const [
                { data: clientsData, error: clientsError },
                { data: invoicesData, error: invoicesError }
            ] = await Promise.all([
                supabase.from('clients').select('*').order('company_name', { ascending: true }),
                supabase.from('invoices').select('client_id, total_amount, amount_paid').not('status', 'eq', 'paid')
            ]);

            if (clientsError) throw clientsError;
            if (invoicesError) throw invoicesError;

            // Calculate receivables per client
            const receivablesMap: Record<string, number> = {};
            (invoicesData || []).forEach(inv => {
                const bal = inv.total_amount - (inv.amount_paid || 0);
                receivablesMap[inv.client_id] = (receivablesMap[inv.client_id] || 0) + bal;
            });

            const mergedClients = (clientsData || []).map(c => ({
                ...c,
                receivables: receivablesMap[c.id] || 0
            }));

            setClients(mergedClients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('clients').insert([newClient]);
            if (error) throw error;

            toast({ title: "Enterprise Record Created", description: `${newClient.company_name} has been indexed.` });
            setIsDialogOpen(false);
            setNewClient(initialClientState);
            fetchClients();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;
        try {
            const { error } = await supabase
                .from('clients')
                .update(editingClient)
                .eq('id', editingClient.id);
            if (error) throw error;

            toast({ title: "Master Record Updated", description: "Customer metadata synchronized." });
            setIsEditDialogOpen(false);
            fetchClients();
        } catch (error: any) {
            toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm("Confirm Record Archiving?")) return;
        try {
            const { error } = await supabase.from('clients').update({ status: 'archived' }).eq('id', id);
            if (error) throw error;
            toast({ title: "Operation Success" });
            fetchClients();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleExportCSV = () => {
        const headers = ["Company", "First Name", "Last Name", "Email", "Phone", "Website", "Total Receivables"];
        const rows = filteredClients.map(c => [
            c.company_name, c.first_name || '', c.last_name || '', c.email || '', c.phone_work || '', c.website || '', c.receivables || 0
        ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `Nashied_Client_Master_${new Date().toISOString()}.csv`);
        link.click();
    };

    const handleSort = (key: keyof Client) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredClients = useMemo(() => {
        let result = clients.filter(c =>
            c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [clients, searchTerm, sortConfig]);

    const toggleSelectAll = () => {
        if (selectedClients.length === filteredClients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(filteredClients.map(c => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedClients(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <DashboardLayout headerTitle="Enterprise Client Hub">
            <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">

                {/* GLOBAL HEADER */}
                <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold font-display tracking-tight text-foreground">Customer Master</h2>
                            <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 text-[10px] font-bold">{filteredClients.length} Profiles</Badge>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">High-Density Intelligence Architecture</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-primary hover:bg-primary/95 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 px-8 h-12">
                                    <Plus className="mr-2 h-4 w-4" /> Add Enterprise Record
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                                <div className="bg-primary p-8 text-white">
                                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Register Client Entity</h2>
                                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Populating Meta-Database for Nashied Creative Cloud</p>
                                </div>
                                <form onSubmit={handleCreateClient}>
                                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                        {/* CUSTOMER TYPE TOGGLE */}
                                        <div className="flex items-center gap-8 mb-4">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Customer Type</Label>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setNewClient({ ...newClient, customer_type: 'Business' })}>
                                                    <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-all", newClient.customer_type === 'Business' ? "border-primary bg-primary" : "border-muted-foreground/30")}>
                                                        {newClient.customer_type === 'Business' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">Business</span>
                                                </div>
                                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setNewClient({ ...newClient, customer_type: 'Individual' })}>
                                                    <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-all", newClient.customer_type === 'Individual' ? "border-primary bg-primary" : "border-muted-foreground/30")}>
                                                        {newClient.customer_type === 'Individual' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">Individual</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* PRIMARY CONTACT AREA */}
                                        <div className="flex items-start gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px] pt-4">Primary Contact</Label>
                                            <div className="flex-1 grid grid-cols-6 gap-3">
                                                <div className="col-span-1">
                                                    <Input value={newClient.salutation} onChange={e => setNewClient({ ...newClient, salutation: e.target.value })} placeholder="Salutation" className="h-10 rounded-xl" />
                                                </div>
                                                <div className="col-span-2">
                                                    <Input required value={newClient.first_name} onChange={e => setNewClient({ ...newClient, first_name: e.target.value })} placeholder="First Name" className="h-10 rounded-xl" />
                                                </div>
                                                <div className="col-span-3">
                                                    <Input required value={newClient.last_name} onChange={e => setNewClient({ ...newClient, last_name: e.target.value })} placeholder="Last Name" className="h-10 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Company Name</Label>
                                            <Input required value={newClient.company_name} onChange={e => {
                                                const val = e.target.value;
                                                setNewClient({ ...newClient, company_name: val, display_name: val });
                                            }} className="flex-1 h-10 rounded-xl font-bold bg-muted/20 border-border/40" />
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-primary min-w-[120px]">Display Name</Label>
                                            <Input required value={newClient.display_name} onChange={e => setNewClient({ ...newClient, display_name: e.target.value })} className="flex-1 h-11 rounded-xl font-bold bg-primary/5 border-primary/20" />
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Email Address</Label>
                                            <Input type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                        </div>

                                        <div className="flex items-start gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px] pt-4">Phone</Label>
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <Input value={newClient.phone_work} onChange={e => setNewClient({ ...newClient, phone_work: e.target.value })} placeholder="Work Phone" className="h-10 rounded-xl pl-4" />
                                                </div>
                                                <div className="relative">
                                                    <Input value={newClient.phone_mobile} onChange={e => setNewClient({ ...newClient, phone_mobile: e.target.value })} placeholder="Mobile" className="h-10 rounded-xl pl-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 border-b border-border/20 pb-6 mb-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Language</Label>
                                            <Input value={newClient.customer_language} onChange={e => setNewClient({ ...newClient, customer_language: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                        </div>

                                        <Tabs defaultValue="other" className="w-full">
                                            <TabsList className="bg-transparent gap-8 h-10 p-0 border-b border-border/20 w-full mb-6">
                                                <TabsTrigger value="other" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Other Details</TabsTrigger>
                                                <TabsTrigger value="address" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Address</TabsTrigger>
                                                <TabsTrigger value="remarks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Remarks</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="other" className="space-y-6 animate-in fade-in duration-300">
                                                <div className="flex items-center gap-8">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Currency</Label>
                                                    <Input value={newClient.currency} onChange={e => setNewClient({ ...newClient, currency: e.target.value })} className="flex-1 h-10 rounded-xl bg-muted/10" />
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Tax Rate</Label>
                                                    <Input value={newClient.tax_rate} onChange={e => setNewClient({ ...newClient, tax_rate: e.target.value })} placeholder="Select a Tax" className="flex-1 h-10 rounded-xl" />
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Payment Terms</Label>
                                                    <Input value={newClient.payment_terms} onChange={e => setNewClient({ ...newClient, payment_terms: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Financials</Label>
                                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                                        <Input type="number" placeholder="Opening Balance" value={newClient.opening_balance} onChange={e => setNewClient({ ...newClient, opening_balance: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl" />
                                                        <Input type="number" placeholder="Credit Limit" value={newClient.credit_limit} onChange={e => setNewClient({ ...newClient, credit_limit: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl border-orange-200" />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="address" className="space-y-4 animate-in fade-in duration-300">
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/60 border-b border-primary/10 pb-2">Billing Address</h4>
                                                        <div className="space-y-2">
                                                            <Input placeholder="Attention" value={newClient.address_billing?.attention} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, attention: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            <Textarea placeholder="Street Address" value={newClient.address_billing?.street1} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, street1: e.target.value } })} className="min-h-[60px] text-[11px] rounded-lg" />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Input placeholder="City" value={newClient.address_billing?.city} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, city: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                                <Input placeholder="State" value={newClient.address_billing?.state} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, state: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Input placeholder="Zip" value={newClient.address_billing?.zip} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, zip: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                                <Input placeholder="Country" value={newClient.address_billing?.country} onChange={e => setNewClient({ ...newClient, address_billing: { ...newClient.address_billing, country: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between border-b border-border/10 pb-2">
                                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</h4>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setNewClient({ ...newClient, address_shipping: { ...newClient.address_billing } })}
                                                                className="h-6 px-3 rounded-md text-[9px] font-bold uppercase tracking-tighter hover:bg-primary/10 hover:text-primary transition-all"
                                                            >
                                                                Copy Billing
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Input placeholder="Attention" value={newClient.address_shipping?.attention} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, attention: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            <Textarea placeholder="Street Address" value={newClient.address_shipping?.street1} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, street1: e.target.value } })} className="min-h-[60px] text-[11px] rounded-lg" />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Input placeholder="City" value={newClient.address_shipping?.city} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, city: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                                <Input placeholder="State" value={newClient.address_shipping?.state} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, state: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Input placeholder="Zip" value={newClient.address_shipping?.zip} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, zip: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                                <Input placeholder="Country" value={newClient.address_shipping?.country} onChange={e => setNewClient({ ...newClient, address_shipping: { ...newClient.address_shipping, country: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="remarks" className="animate-in fade-in duration-300">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Internal Narrative / Remarks</Label>
                                                    <Textarea value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })} placeholder="Confidence level, preferred contact method, etc." className="min-h-[150px] rounded-2xl p-4 bg-muted/5 font-medium text-sm leading-relaxed" />
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                    <div className="p-8 bg-muted/5 border-t border-border/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="h-6 rounded-lg text-[9px] font-bold border-dashed opacity-50 uppercase">Schema: Nashied-CRM-v4</Badge>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px]">Discard</Button>
                                            <Button type="submit" className="rounded-xl font-bold uppercase text-[11px] h-11 tracking-widest px-10 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">Register Entity</Button>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="icon" onClick={handleExportCSV} className="h-12 w-12 rounded-xl border-border/60 text-muted-foreground hover:text-green-600 transition-all hover:bg-green-50"><Download className="h-5 w-5" /></Button>

                        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/60 text-muted-foreground hover:text-blue-600 transition-all hover:bg-blue-50">
                                    <Upload className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                                <div className="bg-blue-600 p-8 text-white">
                                    <h2 className="text-xl font-bold uppercase tracking-tighter">Import Intelligence</h2>
                                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Bulk Data Migration Engine</p>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="border-2 border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-600 transition-all bg-muted/20 relative cursor-pointer">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <div className="text-center">
                                            <p className="text-xs font-bold uppercase">Click to Deploy CSV</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">UTF-8 Encoded Spreadsheets Only</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleImportCSV}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={importLoading}
                                        />
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase">
                                            The engine automatically maps columns for Company, Names, Email, and Phone. Ensure the first row contains valid headers.
                                        </p>
                                    </div>
                                    {importLoading && (
                                        <div className="flex items-center justify-center gap-2 py-4">
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 ml-2">Migrating Cluster Data...</span>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* HIGH-DENSITY TABLE UI */}
                <div className="bg-card border border-border/40 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                    <div className="p-4 bg-muted/10 border-b border-border/40 flex items-center justify-between">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                            <Input
                                placeholder="Search Display Name, Company, Email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 w-96 bg-transparent border-none focus-visible:ring-0 text-xs font-bold uppercase tracking-tighter"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground"><Filter className="mr-1.5 h-3.5 w-3.5" /> Filter</Button>
                            <Button variant="ghost" size="icon" onClick={fetchClients} className="h-8 w-8 rounded-lg text-primary"><RefreshCw className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/40 bg-muted/5 border-b border-border/30">
                                    <th className="px-6 py-5 w-10"></th>
                                    <th className="px-4 py-5 font-bold whitespace-nowrap cursor-pointer hover:text-primary" onClick={() => handleSort('company_name')}>Display Name <ArrowUpDown className="inline ml-1 h-3 w-3" /></th>
                                    <th className="px-4 py-5">Company Name</th>
                                    <th className="px-4 py-5">Phone</th>
                                    <th className="px-4 py-5">Status</th>
                                    <th className="px-4 py-5">Portal</th>
                                    <th className="px-4 py-5 text-right">Balance Due</th>
                                    <th className="px-6 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="group hover:bg-muted/40 transition-all duration-150 border-none cursor-default">
                                        <td className="px-6 py-4"><Input type="checkbox" className="h-3.5 w-3.5 rounded border-border/50" /></td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-primary hover:underline cursor-pointer uppercase tracking-tight" onClick={() => { setEditingClient(client); setIsEditDialogOpen(true); }}>
                                                    {client.display_name || `${client.salutation || ''} ${client.first_name || ''} ${client.last_name || ''}`.trim() || client.company_name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/50 font-medium lowercase italic">{client.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground">{client.company_name}</span>
                                        </td>
                                        <td className="px-4 py-4 text-[11px] font-bold text-muted-foreground/80">{client.phone_work || '---'}</td>
                                        <td className="px-4 py-4">
                                            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-widest rounded-full px-3 py-1",
                                                client.status === 'active' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-muted text-muted-foreground"
                                            )}>
                                                {client.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4">
                                            {client.portal_enabled ? <UserCheck className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-dashed border-border/50" />}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">${(client.receivables || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                {client.opening_balance && client.opening_balance > 0 ? (
                                                    <span className="text-[9px] font-bold text-orange-600 uppercase">OB: ${client.opening_balance.toLocaleString()}</span>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-border/50">
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-widest py-3" onClick={() => { setEditingClient(client); setIsEditDialogOpen(true); }}>
                                                        <Edit3 className="h-4 w-4 text-orange-500" /> Modify Metadata
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-widest py-3">
                                                        <Globe className="h-4 w-4 text-blue-500" /> Open Portal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="opacity-50" />
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-widest py-3 text-destructive" onClick={() => handleDeleteClient(client.id)}>
                                                        <Trash2 className="h-4 w-4" /> Archive Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SYNC/EDIT DIALOG */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
                    <div className="bg-orange-600 p-8 text-white">
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">Synchronize Entity</h2>
                        <p className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1">Updating Master Record in Production Database</p>
                    </div>
                    {editingClient && (
                        <form onSubmit={handleUpdateClient}>
                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* CUSTOMER TYPE TOGGLE */}
                                <div className="flex items-center gap-8 mb-4">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Customer Type</Label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingClient({ ...editingClient, customer_type: 'Business' })}>
                                            <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-all", editingClient.customer_type === 'Business' ? "border-orange-600 bg-orange-600" : "border-muted-foreground/30")}>
                                                {editingClient.customer_type === 'Business' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-tight">Business</span>
                                        </div>
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingClient({ ...editingClient, customer_type: 'Individual' })}>
                                            <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-all", editingClient.customer_type === 'Individual' ? "border-orange-600 bg-orange-600" : "border-muted-foreground/30")}>
                                                {editingClient.customer_type === 'Individual' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-tight">Individual</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PRIMARY CONTACT AREA */}
                                <div className="flex items-start gap-8">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px] pt-4">Primary Contact</Label>
                                    <div className="flex-1 grid grid-cols-6 gap-3">
                                        <div className="col-span-1">
                                            <Input value={editingClient.salutation || ''} onChange={e => setEditingClient({ ...editingClient, salutation: e.target.value })} placeholder="Salutation" className="h-10 rounded-xl" />
                                        </div>
                                        <div className="col-span-2">
                                            <Input required value={editingClient.first_name || ''} onChange={e => setEditingClient({ ...editingClient, first_name: e.target.value })} placeholder="First Name" className="h-10 rounded-xl" />
                                        </div>
                                        <div className="col-span-3">
                                            <Input required value={editingClient.last_name || ''} onChange={e => setEditingClient({ ...editingClient, last_name: e.target.value })} placeholder="Last Name" className="h-10 rounded-xl" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Company Name</Label>
                                    <Input required value={editingClient.company_name} onChange={e => setEditingClient({ ...editingClient, company_name: e.target.value })} className="flex-1 h-10 rounded-xl font-bold bg-muted/10 border-border/40" />
                                </div>

                                <div className="flex items-center gap-8">
                                    <Label className="text-[10px] font-bold uppercase text-orange-600 min-w-[120px]">Display Name</Label>
                                    <Input required value={editingClient.display_name} onChange={e => setEditingClient({ ...editingClient, display_name: e.target.value })} className="flex-1 h-11 rounded-xl font-bold bg-orange-50 border-orange-200" />
                                </div>

                                <div className="flex items-center gap-8">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Email Address</Label>
                                    <Input type="email" value={editingClient.email || ''} onChange={e => setEditingClient({ ...editingClient, email: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                </div>

                                <div className="flex items-start gap-8">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px] pt-4">Phone</Label>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <Input value={editingClient.phone_work || ''} onChange={e => setEditingClient({ ...editingClient, phone_work: e.target.value })} placeholder="Work Phone" className="h-10 rounded-xl" />
                                        <Input value={editingClient.phone_mobile || ''} onChange={e => setEditingClient({ ...editingClient, phone_mobile: e.target.value })} placeholder="Mobile" className="h-10 rounded-xl" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 border-b border-border/20 pb-6 mb-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Language</Label>
                                    <Input value={editingClient.customer_language || ''} onChange={e => setEditingClient({ ...editingClient, customer_language: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                </div>

                                <Tabs defaultValue="other" className="w-full">
                                    <TabsList className="bg-transparent gap-8 h-10 p-0 border-b border-border/20 w-full mb-6">
                                        <TabsTrigger value="other" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Other Details</TabsTrigger>
                                        <TabsTrigger value="address" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Address</TabsTrigger>
                                        <TabsTrigger value="remarks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none font-bold text-[10px] uppercase tracking-widest h-10 px-0 transition-all opacity-50 data-[state=active]:opacity-100">Remarks</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="other" className="space-y-6 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Currency</Label>
                                            <Input value={editingClient.currency || ''} onChange={e => setEditingClient({ ...editingClient, currency: e.target.value })} className="flex-1 h-10 rounded-xl bg-orange-50" />
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Tax Rate</Label>
                                            <Input value={editingClient.tax_rate || ''} onChange={e => setEditingClient({ ...editingClient, tax_rate: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground min-w-[120px]">Payment Terms</Label>
                                            <Input value={editingClient.payment_terms || ''} onChange={e => setEditingClient({ ...editingClient, payment_terms: e.target.value })} className="flex-1 h-10 rounded-xl" />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="address" className="space-y-4 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-orange-600/60 border-b border-orange-600/10 pb-2">Billing Address</h4>
                                                <div className="space-y-2">
                                                    <Input placeholder="Attention" value={editingClient.address_billing?.attention || ''} onChange={e => setEditingClient({ ...editingClient, address_billing: { ...editingClient.address_billing, attention: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                    <Textarea placeholder="Street Address" value={editingClient.address_billing?.street1 || ''} onChange={e => setEditingClient({ ...editingClient, address_billing: { ...editingClient.address_billing, street1: e.target.value } })} className="min-h-[60px] text-[11px] rounded-lg" />
                                                    <Input placeholder="City" value={editingClient.address_billing?.city || ''} onChange={e => setEditingClient({ ...editingClient, address_billing: { ...editingClient.address_billing, city: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                    <Input placeholder="Country" value={editingClient.address_billing?.country || ''} onChange={e => setEditingClient({ ...editingClient, address_billing: { ...editingClient.address_billing, country: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b border-border/10 pb-2">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingClient({ ...editingClient, address_shipping: { ...editingClient.address_billing } })}
                                                        className="h-6 px-3 rounded-md text-[9px] font-bold uppercase tracking-tighter hover:bg-orange-600/10 hover:text-orange-600 transition-all"
                                                    >
                                                        Copy Billing
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <Input placeholder="Attention" value={editingClient.address_shipping?.attention || ''} onChange={e => setEditingClient({ ...editingClient, address_shipping: { ...editingClient.address_shipping, attention: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                    <Textarea placeholder="Street Address" value={editingClient.address_shipping?.street1 || ''} onChange={e => setEditingClient({ ...editingClient, address_shipping: { ...editingClient.address_shipping, street1: e.target.value } })} className="min-h-[60px] text-[11px] rounded-lg" />
                                                    <Input placeholder="City" value={editingClient.address_shipping?.city || ''} onChange={e => setEditingClient({ ...editingClient, address_shipping: { ...editingClient.address_shipping, city: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                    <Input placeholder="Country" value={editingClient.address_shipping?.country || ''} onChange={e => setEditingClient({ ...editingClient, address_shipping: { ...editingClient.address_shipping, country: e.target.value } })} className="h-9 text-[11px] rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="remarks" className="animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Internal Narrative / Remarks</Label>
                                            <Textarea value={editingClient.notes || ''} onChange={e => setEditingClient({ ...editingClient, notes: e.target.value })} className="min-h-[150px] rounded-2xl p-4 bg-muted/5 font-medium text-sm border-orange-200" />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className="p-8 bg-orange-600/5 border-t border-orange-600/10 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl font-bold uppercase text-[10px]">Discard</Button>
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold uppercase text-[11px] h-11 tracking-widest px-10 shadow-2xl shadow-orange-600/30">Apply Sync Changes</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default Clients;
