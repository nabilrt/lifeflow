import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "./ui/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please Enter a Valid Email" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export default function LoginForm() {
    let navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { userLogin, loginLoader, authenticated } = useAuth();

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoginError(null); // Clear previous error
        const errorMessage = await userLogin(values);
        if (errorMessage) {
            setLoginError(errorMessage); // Set error message if login fails
        }
    }

    if (authenticated) {
        navigate("/user/dasboard");
    }
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>
                    Enter your credentials to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="text"
                                                    placeholder="m@example.com"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {loginError && <span className="text-red-600 text-sm">{loginError}</span>}
                            {loginLoader ? (
                                <Button disabled className="w-full">
                                    <Loader2 className="animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            )}
                        </form>
                    </FormProvider>
                </div>
            </CardContent>
        </Card>
    );
}
