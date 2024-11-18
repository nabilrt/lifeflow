import * as React from "react";
import {
    ClipboardCheck,
    LayoutDashboard,
    Map,
    Pyramid,
    Wallet,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";
import { Link } from "react-router-dom";

// This is sample data.
const data = {
    projects: [
        {
            name: "Dashboard",
            url: "/user/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Finance",
            url: "/user/finance",
            icon: Wallet,
        },
        {
            name: "Travel",
            url: "/user/travels",
            icon: Map,
        },
        {
            name: "Task",
            url: "/user/task",
            icon: ClipboardCheck,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Pyramid className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        LifeFlow
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
