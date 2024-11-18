import LoginForm from "@/components/LoginForm";
import NavBar from "@/components/Navbar";

const Login = () => {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    LifeFlow
                </h1>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
