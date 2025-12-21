import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    FileText,
    ExternalLink,
    Shield,
    Users as UsersIcon,
    Globe,
    Search,
    Filter,
    FolderLock,
    MoreHorizontal,
    Cloud,
    Lock,
    Eye,
    Trash2,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Doc {
    id: string;
    client_id: string;
    project_id: string | null;
    name: string;
    url: string;
    access_level: 'internal' | 'client_view' | 'public';
    created_at: string;
    client: { company_name: string } | null;
}

const Documents = () => {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [newDoc, setNewDoc] = useState({
        client_id: '',
        project_id: null as string | null,
        name: '',
        url: '',
        access_level: 'internal'
    });

    useEffect(() => {
        fetchDocs();
        fetchClients();
        fetchProjects();
    }, []);

    const fetchDocs = async () => {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*, client:clients(company_name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // @ts-ignore
            setDocs(data || []);
        } catch (error: any) {
            console.error('Error fetching docs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        const { data } = await supabase.from('clients').select('id, company_name');
        setClients(data || []);
    };

    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('id, name');
        setProjects(data || []);
    };

    const handleCreateDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('documents').insert([newDoc]);
            if (error) throw error;

            toast({ title: "Resource Vault Entry Created", description: "Secure link has been registered in the cloud repository." });
            setIsDialogOpen(false);
            setNewDoc({ client_id: '', project_id: null, name: '', url: '', access_level: 'internal' });
            fetchDocs();
        } catch (error: any) {
            toast({ title: "Registry Error", description: error.message, variant: "destructive" });
        }
    };

    const filteredDocs = useMemo(() => {
        return docs.filter(doc =>
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.client?.company_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [docs, searchQuery]);

    const getAccessMeta = (level: string) => {
        switch (level) {
            case 'public': return { icon: Globe, label: 'Public Access', color: 'text-green-600 bg-green-50 border-green-100' };
            case 'client_view': return { icon: UsersIcon, label: 'Client Visible', color: 'text-blue-600 bg-blue-50 border-blue-100' };
            default: return { icon: Lock, label: 'Internal Only', color: 'text-orange-600 bg-orange-50 border-orange-100' };
        }
    };

    return (
        <DashboardLayout headerTitle="Resource Vault">
            <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">

                {/* 1️⃣ COMMAND HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-card p-10 rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                <FolderLock className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground uppercase">Cloud Repository</h2>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Architecting Secure Access to Agency Intellectual Property</p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search repository..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 pl-12 rounded-xl border-border/50 bg-muted/20 focus-visible:ring-primary/20 font-bold"
                            />
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-12 px-8 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20">
                                    <Plus className="mr-2 h-4 w-4" /> Register Resource
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg rounded-[32px] border-none shadow-2xl">
                                <DialogHeader className="p-6 pb-0">
                                    <DialogTitle className="text-2xl font-bold uppercase tracking-tighter">Vault Registration</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateDoc} className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Master Account Association</Label>
                                        <Select
                                            value={newDoc.client_id}
                                            onValueChange={(val) => setNewDoc({ ...newDoc, client_id: val })}
                                            required
                                        >
                                            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Client Account" /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {clients.map(c => <SelectItem key={c.id} value={c.id} className="font-bold uppercase tracking-tight text-[10px]">{c.company_name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Identifier / Name</Label>
                                        <Input
                                            value={newDoc.name}
                                            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                                            required
                                            placeholder="e.g. FY24 Strategy Architecture"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Resource Point (Cloud URL)</Label>
                                        <Input
                                            value={newDoc.url}
                                            onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                                            required
                                            placeholder="https://drive.google.com/..."
                                            className="h-12 rounded-xl font-mono text-xs"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Security Protocol (Access Level)</Label>
                                        <Select
                                            value={newDoc.access_level}
                                            onValueChange={(val) => setNewDoc({ ...newDoc, access_level: val as any })}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="internal" className="font-bold text-[10px] uppercase">Internal Only (Restricted)</SelectItem>
                                                <SelectItem value="client_view" className="font-bold text-[10px] uppercase">Client Visible (Secure Edge)</SelectItem>
                                                <SelectItem value="public" className="font-bold text-[10px] uppercase">Public Domain (Unrestricted)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 mt-4">Execute Registration</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* 2️⃣ REPOSITORY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => {
                        const meta = getAccessMeta(doc.access_level);
                        const AccessIcon = meta.icon;
                        return (
                            <Card key={doc.id} className="group border-border/40 shadow-xl rounded-[28px] overflow-hidden bg-white hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
                                <CardContent className="p-0">
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="h-14 w-14 bg-muted/30 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                <FileText className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-tight"><Eye className="h-3.5 w-3.5 text-blue-500" /> View Detail</DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-tight"><Cloud className="h-3.5 w-3.5 text-orange-500" /> Sync Cloud</DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 font-bold text-[10px] uppercase tracking-tight text-destructive"><Trash2 className="h-3.5 w-3.5" /> Purge Resource</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg tracking-tight truncate uppercase leading-tight">{doc.name}</h3>
                                            <p className="text-[10px] font-bold uppercase text-primary tracking-widest truncate">{doc.client?.company_name || 'Internal Operations'}</p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none", meta.color)}>
                                                <AccessIcon className="h-3 w-3 mr-1.5" /> {meta.label}
                                            </Badge>
                                            <div className="flex-1 h-px bg-divider/10" />
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-muted/5 border-t border-border/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                            <Calendar className="h-3 w-3" /> {new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:text-primary group" asChild>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                Launch <ExternalLink className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {!loading && docs.length === 0 && (
                        <div className="col-span-full text-center py-32 space-y-4 bg-muted/10 rounded-[40px] border-2 border-dashed border-border/50">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                                <FolderLock className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Repository Empty</p>
                                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase racking-tight">No secure resources identified in the vault.</p>
                            </div>
                            <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl border-dashed px-8 h-10 text-[10px] font-bold uppercase tracking-widest">Initialize Registry</Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Documents;
