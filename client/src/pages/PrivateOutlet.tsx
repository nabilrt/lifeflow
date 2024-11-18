import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../lib/context/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";

export default function PrivateOutlet() {
    const { authenticated } = useAuth();

    return authenticated ? (
        <div className="flex min-h-screen w-full flex-col">
            <SidebarProvider>
                <AppSidebar />

                <main className="flex-grow overflow-auto">
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    ) : (
        <Navigate to="/" />
    );
}
