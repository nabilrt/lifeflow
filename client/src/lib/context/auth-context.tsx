import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { loginUser, userDetails } from "../api/index";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
    userId: number;
    name: string;
    email: string;
    avatar: string;
    walletBalance: number;
    createdAt: string;
}

interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    userLogin: (data: any) => Promise<string | null>;
    loginLoader: boolean;
    logout: () => void;
    authenticated: boolean;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loginLoader, setLoginLoader] = useState<boolean>(false);
    const [authenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                const token = localStorage.getItem("token");

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } else {
                    if (
                        location.pathname !== "/register" &&
                        location.pathname !== "/"
                    ) {
                        const response = await userDetails();
                        if (response?.data?.user) {
                            setUser(response.data);
                            setIsAuthenticated(true);
                            localStorage.setItem(
                                "user",
                                JSON.stringify(response.data)
                            );
                        } else {
                            navigate("/");
                        }
                    }
                }
            } catch (error) {
                setIsAuthenticated(false);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        checkLogin();
    }, [
        navigate,
        location.pathname !== "/register" && location.pathname !== "/",
    ]);

    const userLogin = async (data: any): Promise<string | null> => {
        setLoginLoader(true);
        try {
            const response = await loginUser(data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                const userData = await userDetails();
                setUser(userData.data);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(userData.data));
                navigate("/user/dashboard");
                return null;
            } else {
                return "Invalid username or password.";
            }
        } catch (error) {
            return "An error occurred during login. Please try again.";
        } finally {
            setLoginLoader(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (location.pathname === "/") {
            navigate("/");
        } else {
            navigate("/");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                userLogin,
                loginLoader,
                logout,
                authenticated,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
