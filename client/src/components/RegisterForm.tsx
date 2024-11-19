import { useState } from "react";
import { CgProfile } from "react-icons/cg";
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
import { registerUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please Enter a Valid Email" }),
    password: z.string().min(1, { message: "Password is required" }),
    file: z
        .any()
        .refine(
            (file) =>
                file instanceof File &&
                ACCEPTED_IMAGE_TYPES.includes(file.type),
            {
                message:
                    "Invalid file type. Only JPEG, PNG, and GIF are accepted.",
            }
        )
        .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 5MB.",
        }),
});

export default function RegisterForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            file: "",
        },
    });
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [imageLink, setImageLink] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImageLink(imageURL);
            form.setValue("file", file); // Update the form value with the selected file
        }
    };

    const handleUploadImageClick = () => {
        document.getElementById("fileUpload")?.click();
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        if (values.file) {
            formData.append("file", values.file);
        }
        try {
            await registerUser(formData);
            setLoading(false);
            navigate("/");
        } catch (error: any) {
            setLoading(false);
            setError(error.message);
        } finally {
            setTimeout(() => {
                setError("");
            }, 2000);
        }
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                    Registration
                </CardTitle>
                <CardDescription>
                    Enter your details to join the community of people.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {error !== "" && (
                                <Alert variant={"destructive"} className="mb-4">
                                    <CircleCheck className="h-4 w-4" />

                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="John Doe"
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
                            <div className="text-center mt-2">
                                <div className="flex gap-2 items-center">
                                    <div className="w-[150px] h-[150px] rounded-full border border-[#e5eaf2] flex items-center justify-center mx-auto ">
                                        {imageLink === "" ? (
                                            <CgProfile className="text-[6rem] text-[#e5eaf2]" />
                                        ) : (
                                            <img
                                                src={imageLink}
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant={"default"}
                                        onClick={handleUploadImageClick}
                                    >
                                        Upload Picture
                                    </Button>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    id="fileUpload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-5"
                                disabled={loading}
                            >
                                {loading ? "Please Wait..." : "Register"}
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </CardContent>
        </Card>
    );
}
