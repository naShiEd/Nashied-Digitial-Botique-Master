
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Bell, User, Key, LogOut, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
    children: React.ReactNode;
    headerTitle?: string;
}

const DashboardLayout = ({ children, headerTitle = "Overview" }: DashboardLayoutProps) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user, profile, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Sidebar />

            <div className="md:pl-64 flex flex-col min-h-screen">
                <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 pt-10">
                                <Sidebar />
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-xl font-display font-bold text-foreground border-l-4 border-primary pl-4">{headerTitle}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Create (+) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm" className="hidden sm:flex items-center gap-2 rounded-full px-4">
                                    <Plus className="h-4 w-4" /> <span>Quick Create</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>New Task</DropdownMenuItem>
                                <DropdownMenuItem>New Project</DropdownMenuItem>
                                {['super_admin', 'admin', 'finance'].includes(profile?.role || '') && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>New Invoice</DropdownMenuItem>
                                        <DropdownMenuItem>New Bill</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative group">
                            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 pl-2 border-l border-border hover:opacity-80 transition-opacity cursor-pointer">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-xs font-bold font-display uppercase tracking-widest text-primary italic">
                                            {profile?.role || "Guest"}
                                        </span>
                                        <span className="text-xs text-muted-foreground group-hover:text-foreground">{user?.email?.split('@')[0]}</span>
                                    </div>
                                    <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuLabel className="font-display">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2"><User className="h-4 w-4" /> My Profile</DropdownMenuItem>
                                <DropdownMenuItem className="gap-2"><Key className="h-4 w-4" /> Change Password</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <LogOut className="h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
