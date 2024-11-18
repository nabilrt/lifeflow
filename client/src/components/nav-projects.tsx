import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2,
    type LucideIcon,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavProjects({
    projects,
}: {
    projects: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    let location = useLocation();
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.url}
                        >
                            <Link to={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem></SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
