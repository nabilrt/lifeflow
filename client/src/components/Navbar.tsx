import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/context/theme-context";
import { Sun, Moon, LifeBuoy } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
const NavBar = () => {
    const { setTheme } = useTheme();
    let location = useLocation();

    return (
        <div className="">
            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90 ">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-14 items-center">
                        <Link to="#" className="flex items-center">
                            <LifeBuoy className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {location.pathname !== "/" && (
                                <Link to={"/"}>
                                    <Button variant="outline" size="sm">
                                        Sign in
                                    </Button>
                                </Link>
                            )}
                            {location.pathname !== "/register" && (
                                <Link to={"/register"}>
                                    <Button size="sm">Sign up</Button>
                                </Link>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">
                                            Toggle theme
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setTheme("light")}
                                    >
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("dark")}
                                    >
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("system")}
                                    >
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
