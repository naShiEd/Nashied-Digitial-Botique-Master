
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    Users,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    ShoppingBag,
    Wallet,
    BarChart3,
    UserCircle,
    ChevronRight,
    PlusCircle,
    Clock,
    ClipboardList,
    Receipt,
    Calculator,
    ShieldCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import nashiedLogo from "@/assets/nashied-logo.png";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubItem {
    label: string;
    href: string;
}

interface SidebarItem {
    icon: any;
    label: string;
    href?: string;
    roles: string[];
    subItems?: SubItem[];
}

const sidebarItems: SidebarItem[] = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/dashboard",
        roles: ['super_admin', 'admin', 'finance', 'pm', 'creative', 'client']
    },
    {
        icon: CheckSquare,
        label: "Taskmaster",
        href: "/dashboard/tasks", // FLAT - NO SUB-ITEMS
        roles: ['super_admin', 'admin', 'pm', 'creative']
    },
    {
        icon: Briefcase,
        label: "Projects",
        roles: ['super_admin', 'admin', 'pm', 'creative', 'client'],
        subItems: [
            { label: "Active Projects", href: "/dashboard/projects" },
            { label: "Project Archive", href: "/dashboard/projects/archive" },
        ]
    },
    {
        icon: Users,
        label: "Customers",
        roles: ['super_admin', 'admin', 'pm'],
        subItems: [
            { label: "Customer List", href: "/dashboard/clients" },
            { label: "Contacts", href: "/dashboard/clients/contacts" },
            { label: "Communication Logs", href: "/dashboard/clients/logs" },
        ]
    },
    {
        icon: Receipt,
        label: "Sales & Revenue",
        href: "/dashboard/finance",
        roles: ['super_admin', 'admin', 'finance'],
    },
    {
        icon: ShoppingBag,
        label: "Purchases",
        href: "/dashboard/purchases",
        roles: ['super_admin', 'admin', 'finance'],
    },
    {
        icon: UserCircle,
        label: "Payroll & HR",
        href: "/dashboard/payroll",
        roles: ['super_admin', 'admin', 'finance'],
    },
    {
        icon: BarChart3,
        label: "Reports",
        href: "/dashboard/reports",
        roles: ['super_admin', 'admin', 'finance', 'pm'],
    },
    {
        icon: FileText,
        label: "Documents",
        href: "/dashboard/documents",
        roles: ['super_admin', 'admin', 'finance', 'pm', 'creative', 'client']
    },
];

const Sidebar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { signOut, profile } = useAuth();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
        );
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const currentRole = profile?.role || 'client';
    const filteredItems = sidebarItems.filter(item =>
        !item.roles || item.roles.includes(currentRole)
    );

    return (
        <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border h-screen fixed left-0 top-0 z-40 shadow-sm overflow-hidden">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border bg-background/50 backdrop-blur-md shrink-0">
                <img src={nashiedLogo} alt="Nashied" className="h-7 w-auto mr-3" />
                <span className="font-display font-bold text-lg tracking-tight text-primary">IAMS</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                {filteredItems.map((item) => {
                    const isGroupOpen = openMenus.includes(item.label);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isActive = item.href ? pathname === item.href : item.subItems?.some(s => pathname === s.href);

                    return (
                        <div key={item.label}>
                            {hasSubItems ? (
                                <Collapsible open={isGroupOpen} onOpenChange={() => toggleMenu(item.label)}>
                                    <CollapsibleTrigger asChild>
                                        <button className={cn(
                                            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group hover:bg-muted font-display uppercase tracking-wider text-[11px]",
                                            isActive && !isGroupOpen && "bg-primary/5 text-primary border-primary/20"
                                        )}>
                                            <div className="flex items-center">
                                                <item.icon className={cn("h-4 w-4 mr-3 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                                <span>{item.label}</span>
                                            </div>
                                            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", isGroupOpen && "rotate-90")} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-1 mt-1 ml-4 border-l border-border/50 pl-2">
                                        {item.subItems?.map((sub) => (
                                            <Link
                                                key={sub.href}
                                                to={sub.href}
                                                className={cn(
                                                    "block px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors",
                                                    pathname === sub.href
                                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <Link
                                    to={item.href || "#"}
                                    className={cn(
                                        "flex items-center px-3 py-2.5 rounded-xl text-[11px] font-display font-bold uppercase tracking-wider transition-all duration-200 group",
                                        pathname === item.href
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4 mr-3 transition-colors", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border bg-muted/20 space-y-2 shrink-0">
                <Link
                    to="/dashboard/settings"
                    className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                        pathname === "/dashboard/settings" && "bg-muted text-foreground font-bold"
                    )}
                >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;
