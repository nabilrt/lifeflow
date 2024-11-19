export type TaskFormData = {
    name: string;
    priority: "low" | "medium" | "high";
    description?: string | undefined;
    isCompleted?: boolean | undefined;
};
