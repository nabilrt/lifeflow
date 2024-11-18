import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./lib/context/auth-context";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateOutlet from "./pages/PrivateOutlet";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import { ThemeProvider } from "./lib/context/theme-context";
import Settings from "./pages/Settings";
import { Toaster } from "./components/ui/toaster";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <AuthContextProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/user/*" element={<PrivateOutlet />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AuthContextProvider>
            </ThemeProvider>
            <Toaster />
        </>
    );
}

export default App;
