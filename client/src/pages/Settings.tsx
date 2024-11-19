"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/lib/context/theme-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { updateUserPassword } from "@/lib/api";
import { CircleAlertIcon, CircleCheck } from "lucide-react";

const passwordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;
export default function Settings() {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [apiLoading, setAPILoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            setAPILoading(true);
            const response = await updateUserPassword({
                newPassword: data.newPassword,
            });
            setAlert({ type: "success", message: response.data.message });
            form.reset();
        } catch (error: any) {
            setAlert({ type: "error", message: error.message });
            form.reset();
        } finally {
            setAPILoading(false);
            setTimeout(() => {
                setAlert(null);
            }, 2000);
        }
    };

    const toggleTheme = (newTheme: "light" | "dark") => {
        if (theme !== newTheme) {
            setIsLoading(true);
            setTimeout(() => {
                setTheme(newTheme);
                setIsLoading(false);
            }, 300);
        }
    };

    return (
        <main className="flex flex-col h-full w-full p-4 md:p-8">
            <Card className="w-full max-w-md mx-auto my-auto">
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                        Manage your app preferences and security
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-2">
                            Change Password
                        </h3>
                        {alert && (
                            <Alert
                                variant={
                                    alert.type === "success"
                                        ? "default"
                                        : "destructive"
                                }
                                className="mb-4"
                            >
                                {alert.type === "success" ? (
                                    <CircleAlertIcon className="h-4 w-4" />
                                ) : (
                                    <CircleCheck className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {alert.type === "success"
                                        ? "Success"
                                        : "Error"}
                                </AlertTitle>
                                <AlertDescription>
                                    {alert.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <FormProvider {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={apiLoading}>
                                    {apiLoading
                                        ? "Updating..."
                                        : "Change Password"}
                                </Button>
                            </form>
                        </FormProvider>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Theme</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className={`text-left ${
                                    theme === "dark"
                                        ? "ring-2 ring-primary rounded-xl"
                                        : ""
                                }`}
                                onClick={() => toggleTheme("dark")}
                                disabled={isLoading}
                                aria-label="Switch to dark theme"
                            >
                                <Card className="p-4 dark:bg-gray-800 transition-colors duration-200">
                                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-600" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-600" />
                                    <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Dark Theme
                                    </p>
                                </Card>
                            </button>
                            <button
                                className={`text-left ${
                                    theme === "light"
                                        ? "ring-2 ring-primary rounded-xl"
                                        : ""
                                }`}
                                onClick={() => toggleTheme("light")}
                                disabled={isLoading}
                                aria-label="Switch to light theme"
                            >
                                <Card className="p-4 bg-white transition-colors duration-200">
                                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-300" />
                                    <p className="mt-2 text-sm font-medium text-gray-600">
                                        Light Theme
                                    </p>
                                </Card>
                            </button>
                        </div>
                        {isLoading && (
                            <div className="mt-2 text-center text-sm text-gray-500">
                                Applying theme...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
