import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { InvoiceTemplate } from "@/components/finance/InvoiceTemplate";
import { Button } from "@/components/ui/button";
import { Download, CreditCard, ChevronLeft, ShieldCheck, Printer, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const ClientPortal = () => {
    const { type, id } = useParams<{ type: string; id: string }>();
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [document, setDocument] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [orgProfile, setOrgProfile] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, [id, type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const table = type === 'invoice' ? 'invoices' : 'quotes';
            const itemTable = type === 'invoice' ? 'invoice_items' : 'quote_items';
            const foreignKey = type === 'invoice' ? 'invoice_id' : 'quote_id';

            const [docRes, itemsRes, orgRes] = await Promise.all([
                supabase.from(table).select('*, client:clients(company_name), project:projects(name)').eq('id', id).single(),
                supabase.from(itemTable).select('*').eq(foreignKey, id),
                supabase.from('organization_profile').select('*').maybeSingle()
            ]);

            if (docRes.error) throw docRes.error;
            setDocument(docRes.data);
            setItems(itemsRes.data || []);
            setOrgProfile(orgRes.data);

            // Set dynamic page title
            const docNum = docRes.data.invoice_number || docRes.data.quote_number || id?.slice(0, 8).toUpperCase();
            window.document.title = `${type === 'invoice' ? 'Invoice' : 'Quote'} ${docNum} | ${orgRes.data?.name || 'Client Portal'}`;

        } catch (err: any) {
            toast({ title: "Authorization Error", description: "The requested document could not be retrieved. Please contact support.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-render-target');
        if (!printContent) return;

        const win = window.open('', '_blank');
        if (!win) return;

        win.document.write(`
            <html>
                <head>
                    <title>${type === 'invoice' ? 'Invoice' : 'Quote'}_${document?.invoice_number || document?.quote_number || id?.slice(0, 5).toUpperCase()}</title>
                    <link rel="stylesheet" href="${window.location.origin}/index.css">
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@100;400;700;800&display=swap');
                        body { background: white !important; font-family: 'Sora', sans-serif !important; -webkit-print-color-adjust: exact; }
                        #invoice-render-target { box-shadow: none !important; border: none !important; width: 100% !important; max-width: none !important; padding: 0 !important; }
                        @page { margin: 20mm; size: auto; }
                        .no-print { display: none !important; }
                    </style>
                </head>
                <body onload="window.print();">
                    ${printContent.outerHTML}
                </body>
            </html>
        `);
        win.document.close();
    };

    const handleInitiatePayment = () => {
        if (!selectedMethod) {
            toast({ title: "Selection Required", description: "Please select a preferred payment method to proceed.", variant: "destructive" });
            return;
        }

        setPaymentLoading(true);
        // Simulate secure payment gateway handoff
        setTimeout(() => {
            setPaymentLoading(false);
            toast({
                title: "Gateway Interface Initialized",
                description: `Routing to secure ${selectedMethod === 'bank' ? 'Bank Transfer' : selectedMethod === 'card' ? 'PCI-DSS Card' : 'Mobile'} payment portal...`,
            });
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="h-16 w-16 border-[6px] border-primary/20 border-t-primary rounded-full animate-spin" />
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Establishing Encrypted Bridge</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Verifying digital signatures via Nashied Trust Network...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-4 p-12 bg-white rounded-[40px] shadow-2xl border border-divider/10 max-w-md mx-4">
                    <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="h-8 w-8 text-muted-foreground opacity-30" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Access Denied</h2>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-widest opacity-60">The requested financial artifact has expired or the security token is invalid.</p>
                    <Button variant="outline" className="mt-4 rounded-2xl px-8" onClick={() => window.location.reload()}>Retry Handshake</Button>
                </div>
            </div>
        );
    }

    const outstanding = document?.total_amount - (document?.amount_paid || 0);

    return (
        <div className="min-h-screen bg-[#f8f9fb] pb-20 font-sans selection:bg-primary selection:text-white">
            {/* PORTAL NAVIGATION BAR */}
            <header className="bg-white/80 backdrop-blur-2xl border-b border-divider/5 px-8 py-5 sticky top-0 z-50 shadow-sm no-print">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform hover:rotate-6 transition-transform">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-black uppercase tracking-tighter leading-none">{orgProfile?.name || 'Nashied Digital'}</h2>
                                <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0 border-none bg-blue-50 text-blue-600">Secure Node</Badge>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 opacity-60">Verified Document Control Center</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-6 group hover:bg-muted" onClick={() => window.close()}>
                            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Exit Portal
                        </Button>
                        <Button className="bg-primary hover:bg-primary/95 rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl shadow-primary/20 transition-all active:scale-95" onClick={handlePrint}>
                            <Printer className="mr-3 h-4 w-4" /> Generate PDF
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto mt-12 px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                {/* PRIMARY DOCUMENT RENDER */}
                <div className="lg:col-span-8 group">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative">
                            <InvoiceTemplate
                                invoiceNumber={document?.invoice_number || document?.quote_number || document?.id.slice(0, 8).toUpperCase()}
                                date={new Date(document?.created_at)}
                                dueDate={new Date(document?.due_date || document?.expiry_date)}
                                terms={type === 'invoice' ? 'Due on Receipt' : 'Valid for 30 Days'}
                                clientName={document?.client?.company_name || 'Valued Partner'}
                                subject={document?.project?.name}
                                items={items.length > 0 ? items : [
                                    {
                                        description: "Enterprise Strategic Consulting & Digital Production",
                                        quantity: 1,
                                        rate: document?.total_amount,
                                        amount: document?.total_amount
                                    }
                                ]}
                                subtotal={document?.total_amount}
                                total={document?.total_amount}
                                balanceDue={outstanding}
                                notes={document?.notes}
                                orgProfile={orgProfile}
                                currency={document?.currency || 'USD'}
                            />
                        </div>
                    </div>
                </div>

                {/* INTERACTIVE ACTION SIDEBAR */}
                <div className="lg:col-span-4 space-y-8 no-print sticky top-32 h-fit">
                    <Card className="bg-white border-divider/10 shadow-2xl rounded-[40px] overflow-hidden border-none ring-1 ring-black/5">
                        <div className="p-10 bg-[#111] text-white space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                                <Activity className="h-32 w-32" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 relative z-10">Outstanding Balance</p>
                            <h3 className="text-5xl font-black tracking-tighter relative z-10 flex items-baseline gap-1">
                                <span className="text-2xl font-bold opacity-40">$</span>
                                {outstanding.toLocaleString()}
                            </h3>
                            <div className="flex gap-2 mt-6 relative z-10">
                                <Badge className={cn(
                                    "px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border-none",
                                    document?.status === 'paid' ? 'bg-green-500 text-white' :
                                        document?.status === 'overdue' ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary'
                                )}>
                                    Status: {document?.status?.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border-white/20 text-white/60">
                                    Ref: #{document?.id.slice(0, 8).toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                                    <div className="h-px bg-divider/10 flex-1" /> Choose Settlement Method <div className="h-px bg-divider/10 flex-1" />
                                </h4>
                                <div className="space-y-3">
                                    <PaymentMethod
                                        id="bank"
                                        label="Instant Bank Transfer"
                                        icon="🏛️"
                                        desc="Local RTGS / USD Nostro Transfer"
                                        selected={selectedMethod === 'bank'}
                                        onClick={() => setSelectedMethod('bank')}
                                    />
                                    <PaymentMethod
                                        id="card"
                                        label="Secure Card Payment"
                                        icon="💳"
                                        desc="Visa, Mastercard & Zimswitch"
                                        selected={selectedMethod === 'card'}
                                        onClick={() => setSelectedMethod('card')}
                                    />
                                    <PaymentMethod
                                        id="mobile"
                                        label="Mobile Remittance"
                                        icon="📱"
                                        desc="Ecocash, OneMoney, InnBucks"
                                        selected={selectedMethod === 'mobile'}
                                        onClick={() => setSelectedMethod('mobile')}
                                    />
                                </div>
                            </div>

                            <Button
                                disabled={paymentLoading || document?.status === 'paid'}
                                onClick={handleInitiatePayment}
                                className="w-full h-16 rounded-[22px] bg-primary hover:bg-primary/95 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:grayscale disabled:opacity-50 group overflow-hidden relative"
                            >
                                {paymentLoading ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Handshaking Gateway...
                                    </>
                                ) : (
                                    <>
                                        Authorize Settlement <CheckCircle2 className="ml-3 h-5 w-5 group-hover:scale-125 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-60">
                                Need technical assistance? Contact our <br />
                                <span className="text-primary font-black hover:underline cursor-pointer">Global Financial Support Units</span>
                            </p>
                        </div>
                    </Card>

                    <div className="p-8 bg-blue-50/50 border border-blue-100/50 rounded-[35px] flex items-start gap-5 group hover:bg-blue-50 transition-colors">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Quantum Grade Encryption</p>
                            <p className="text-[10px] text-blue-600/70 font-bold leading-relaxed uppercase tracking-tight">
                                Document integrity is managed via Nashied's Secure Edge. All access telemetry is logged for institutional audit trails.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface PaymentMethodProps {
    id: string;
    label: string;
    icon: string;
    desc: string;
    selected: boolean;
    onClick: () => void;
}

const PaymentMethod = ({ label, icon, desc, selected, onClick }: PaymentMethodProps) => (
    <div
        onClick={onClick}
        className={cn(
            "p-5 border-2 rounded-[24px] cursor-pointer transition-all duration-300 group relative overflow-hidden",
            selected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-divider/5 hover:border-primary/30 bg-muted/20"
        )}
    >
        {selected && (
            <div className="absolute top-2 right-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
            </div>
        )}
        <div className="flex items-center gap-5 relative z-10">
            <span className={cn("text-2xl transition-transform group-hover:scale-125 duration-500", selected && "scale-110")}>{icon}</span>
            <div>
                <p className={cn("text-[11px] font-black uppercase tracking-tight", selected ? "text-primary" : "text-foreground")}>{label}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60 mt-0.5">{desc}</p>
            </div>
        </div>
    </div>
);

const Activity = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

export default ClientPortal;
