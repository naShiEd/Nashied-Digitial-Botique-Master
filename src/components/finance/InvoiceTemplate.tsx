import { cn } from "@/lib/utils";
import { format } from "date-fns";
import nashiedLogo from "@/assets/nashied-logo.png";

interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface OrgProfile {
    name: string;
    legal_name?: string;
    tax_number?: string;
    email?: string;
    phone?: string;
    website?: string;
    address_street?: string;
    address_city?: string;
    address_country?: string;
    logo_url?: string;
}

interface InvoiceTemplateProps {
    invoiceNumber: string;
    date: Date;
    dueDate: Date;
    terms: string;
    clientName: string;
    subject?: string;
    items: InvoiceItem[];
    subtotal: number;
    total: number;
    balanceDue: number;
    notes?: string;
    currency?: string;
    orgProfile?: Partial<OrgProfile>;
}

export const InvoiceTemplate = ({
    invoiceNumber,
    date,
    dueDate,
    terms,
    clientName,
    subject,
    items,
    subtotal,
    total,
    balanceDue,
    notes,
    currency = "USD",
    orgProfile
}: InvoiceTemplateProps) => {
    const symbol = currency === "USD" ? "$" : currency + " ";

    return (
        <div id="invoice-render-target" className="bg-white p-12 max-w-[800px] mx-auto text-[#333] font-sans print:p-0 print:max-w-none shadow-xl border border-divider/10 animate-in fade-in zoom-in-95 duration-300">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    {orgProfile?.logo_url ? (
                        <img src={orgProfile.logo_url} alt={orgProfile.name} className="h-12 w-auto mb-4" />
                    ) : (
                        <img src={nashiedLogo} alt="Nashied" className="h-10 w-auto mb-2" />
                    )}
                    <div className="text-[11px] leading-relaxed text-muted-foreground uppercase font-bold tracking-wider">
                        <p className="text-[#111] font-black">{orgProfile?.legal_name || orgProfile?.name || "Nashied Creative"}</p>
                        <p>{orgProfile?.address_street || "3 Anchor House, Jason and First"}</p>
                        <p>{orgProfile?.address_city || "Harare"}, {orgProfile?.address_country || "Zimbabwe"}</p>
                        {orgProfile?.tax_number && <p>VAT: {orgProfile.tax_number}</p>}
                        <p>{orgProfile?.phone || "0785394667"}</p>
                        <p className="lowercase italic">{orgProfile?.email || "info@nashiedcreative.co.zw"}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-light uppercase tracking-[0.2em] mb-4 text-[#111]">Invoice</h1>
                    <p className="text-sm font-bold text-muted-foreground"># {invoiceNumber}</p>
                    <div className="mt-8">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Balance Due</p>
                        <p className="text-2xl font-black text-[#111]">{symbol}{balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            {/* Bill To & Dates Section */}
            <div className="grid grid-cols-2 gap-12 mb-8 border-t border-divider/10 pt-8">
                <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Bill To</p>
                    <p className="font-black text-sm uppercase text-[#111]">{clientName}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-bold uppercase">Invoice Date :</span>
                        <span className="font-medium text-right">{format(date, 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-bold uppercase">Terms :</span>
                        <span className="font-medium text-right">{terms}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-bold uppercase">Due Date :</span>
                        <span className="font-medium text-right">{format(dueDate, 'dd MMM yyyy')}</span>
                    </div>
                </div>
            </div>

            {/* Subject Section */}
            {subject && (
                <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Subject :</p>
                    <p className="text-xs font-bold whitespace-pre-wrap text-[#111]">{subject}</p>
                </div>
            )}

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#111] text-white text-[10px] uppercase font-black tracking-widest">
                            <th className="px-4 py-3 w-12">#</th>
                            <th className="px-4 py-3">Item & Description</th>
                            <th className="px-4 py-3 text-right w-20">Qty</th>
                            <th className="px-4 py-3 text-right w-24">Rate</th>
                            <th className="px-4 py-3 text-right w-24">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-divider/30">
                        {items.map((item, index) => (
                            <tr key={index} className="text-xs align-top">
                                <td className="px-4 py-4 font-bold text-muted-foreground">{index + 1}</td>
                                <td className="px-4 py-4">
                                    <div className="whitespace-pre-wrap leading-relaxed font-medium text-[#111]">
                                        {item.description}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right text-muted-foreground font-medium">{item.quantity.toFixed(2)}</td>
                                <td className="px-4 py-4 text-right text-muted-foreground font-medium">{item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-4 text-right font-bold text-[#111]">{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="ml-auto w-full max-w-[300px] border-t-2 border-divider/20 pt-4">
                <div className="flex justify-between items-center py-2 text-xs">
                    <span className="text-muted-foreground font-bold uppercase">Sub Total</span>
                    <span className="font-medium text-[#111]">{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs">
                    <span className="font-black uppercase text-[#111]">Total</span>
                    <span className="font-black text-[#111]">{symbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-4 mt-2 bg-muted/50 rounded-lg">
                    <span className="font-black uppercase text-sm text-[#111]">Balance Due</span>
                    <span className="font-black text-sm text-[#111]">{symbol}{balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Notes Section */}
            {notes && (
                <div className="mt-12 pt-8 border-t border-divider/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Notes</p>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">{notes}</p>
                </div>
            )}

            {/* Footer Text */}
            <div className="mt-20 pt-8 border-t border-divider/10 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-40">
                Authorized Signature : __________________________
                <p className="mt-4">Generated via {orgProfile?.name || 'Nashied Digital Boutique'}</p>
            </div>
        </div>
    );
};
