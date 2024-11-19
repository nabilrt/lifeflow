import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser, uploadAvatarForUser, userDetails } from "@/lib/api";
import { useAuth } from "@/lib/context/auth-context";
import { CircleAlertIcon, CircleCheck } from "lucide-react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";

const ProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [apiLoading, setAPILoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [alertV2, setAlertV2] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.name || "");

    const [imageLink, setImageLink] = useState(user?.avatar || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            const imageURL = URL.createObjectURL(file);
            try {
                const response = await uploadAvatarForUser(formData);
                const userData = await userDetails();
                setUser(userData.data);
                localStorage.setItem("user", JSON.stringify(userData.data));

                setAlertV2({ type: "success", message: response.data.message });
            } catch (error: any) {
                setAlertV2({ type: "error", message: error.message });
            } finally {
                setLoading(false);
                setTimeout(() => {
                    setAlertV2(null);
                }, 2000);
                setImageLink(imageURL);
            }
        }
    };

    const nameChange = async () => {
        try {
            setAPILoading(true);
            const response = await updateUser({
                name,
            });
            const userData = await userDetails();
            setUser(userData.data);
            localStorage.setItem("user", JSON.stringify(userData.data));

            setAlert({ type: "success", message: response.data.message });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setAPILoading(false);
            setTimeout(() => {
                setAlert(null);
            }, 2000);
        }
    };

    const handleUploadImageClick = () => {
        document.getElementById("fileUpload")?.click();
    };

    return (
        <main className="flex flex-col h-full w-full p-4 md:p-8">
            <Card className="w-full max-w-md mx-auto my-auto">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Change your appearance</CardDescription>
                    <div className="flex items-center">
                        {alert && (
                            <Alert
                                variant={
                                    alert.type === "success"
                                        ? "default"
                                        : "destructive"
                                }
                                className="mb-4 items-center"
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
                                    {alert.message ||
                                        "Data Updated Successfully!"}
                                </AlertDescription>
                            </Alert>
                        )}
                        {alertV2 && (
                            <Alert
                                variant={
                                    alertV2.type === "success"
                                        ? "default"
                                        : "destructive"
                                }
                                className="mb-4"
                            >
                                {alertV2.type === "success" ? (
                                    <CircleAlertIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                    <CircleCheck className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {alertV2.type === "success"
                                        ? "Success"
                                        : "Error"}
                                </AlertTitle>
                                <AlertDescription>
                                    {alertV2.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                disabled={loading}
                            >
                                Upload Picture
                            </Button>
                        </div>

                        <Input
                            type="file"
                            id="fileUpload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Full Name</Label>

                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>

                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={user?.email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Wallet</Label>

                        <Input
                            id="name"
                            type="number"
                            value={user?.walletBalance}
                            readOnly
                        />
                        <small className="text-xs text-muted-foreground font-medium leading-none">Go to Settings for updating wallet</small>
                    </div>

                    <Button
                        type="button"
                        className="w-full mt-5"
                        disabled={apiLoading}
                        onClick={nameChange}
                    >
                        {apiLoading ? "Please Wait..." : "Register"}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
};

export default ProfilePage;
