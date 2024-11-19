"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import axios from "../lib/config/axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/lib/context/theme-context";
import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTaskData,
    updateTaskPriority,
    updateTaskStatus,
} from "@/lib/api";

const taskSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Please select a priority",
    }),
    isCompleted: z.boolean().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

type Task = {
    id: number;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    isCompleted: boolean;
    userId: number;
    createdAt: string;
};

export default function CustomCalendar({ setIsUpdated, isUpdated }: any) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { theme } = useTheme();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: "",
            description: "",
            priority: "medium",
        },
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await getAllTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch tasks",
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (editingTask) {
                const updatedTask = await updateTaskData(editingTask.id, data);
                setTasks(
                    tasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
                );
            } else {
                const newTask = await createTask(data);
                setTasks([...tasks, newTask]);
            }
            setIsDialogOpen(false);
            reset();
            setEditingTask(null);
            setIsUpdated(!isUpdated);
            toast({
                title: editingTask ? "Task updated" : "Task created",
                description: `Task "${data.name}" ${
                    editingTask ? "updated" : "created"
                } successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${
                    editingTask ? "update" : "create"
                } task`,
                variant: "destructive",
            });
        }
    };

    const handleDateClick = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
        setEditingTask(null);
        reset();
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setValue("name", task.name);
        setValue("description", task.description);
        setValue("priority", task.priority);
        setIsDialogOpen(true);
    };

    const handleUpdatePriority = async (
        taskId: number,
        newPriority: "low" | "medium" | "high"
    ) => {
        try {
            const updatedTask = await updateTaskPriority(taskId, {
                priority: newPriority,
            });
            setTasks(
                tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
            setIsUpdated(!isUpdated);
            toast({
                title: "Priority updated",
                description: `Task priority updated successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task priority",
                variant: "destructive",
            });
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            // Optimistically update UI

            // Attempt to delete from server
            await deleteTask(taskId);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
            setIsUpdated(!isUpdated);

            toast({
                title: "Task deleted",
                description: "Task has been successfully deleted",
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            toast({
                title: "Error",
                description: "Failed to delete task. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleToggleComplete = async (
        taskId: number,
        isCompleted: true | false
    ) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, {
                isCompleted,
            });
            setTasks(
                tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
            setIsUpdated(!isUpdated);
            toast({
                title: "Task status updated",
                description: `Task marked as ${
                    isCompleted ? "completed" : "incomplete"
                }`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task status",
                variant: "destructive",
            });
        }
    };

    const taskDates = useMemo(() => {
        return tasks.reduce((acc, task) => {
            const dateString = new Date(task.createdAt).toDateString();
            if (!acc[dateString]) {
                acc[dateString] = [];
            }
            acc[dateString].push(task);
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks]);

    const modifiers = useMemo(() => {
        return {
            taskDay: (date: Date) => taskDates[date.toDateString()]?.length > 0,
        };
    }, [taskDates]);

    const modifiersStyles = {
        taskDay: {
            backgroundColor:
                theme === "dark"
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(59, 130, 246, 0.1)",
            borderRadius: "100%",
        },
    };

    return (
        <div className="p-4 bg-background text-foreground">
            <div className="flex space-x-4">
                <div className="w-1/3">
                    <TooltipProvider>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateClick}
                            className="rounded-md border border-border"
                            modifiers={modifiers}
                            classNames={{
                                months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                                month: "space-y-4 w-full flex flex-col",
                                table: "w-full h-full border-collapse space-y-1",
                                head_row: "",
                                row: "w-full mt-2",
                            }}
                            modifiersStyles={modifiersStyles}
                            components={{
                                DayContent: ({ date }) => {
                                    const tasksForDay =
                                        taskDates[date.toDateString()];
                                    return (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {date.getDate()}
                                                </div>
                                            </TooltipTrigger>
                                            {tasksForDay && (
                                                <TooltipContent>
                                                    <ul
                                                        className={`list-disc pl-4`}
                                                    >
                                                        {tasksForDay.map(
                                                            (task) => (
                                                                <li
                                                                    key={
                                                                        task.id
                                                                    }
                                                                >
                                                                    <span
                                                                        className={`${
                                                                            task.isCompleted
                                                                                ? "line-through"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {
                                                                            task.name
                                                                        }{" "}
                                                                    </span>
                                                                    <span
                                                                        className={`${
                                                                            task.isCompleted
                                                                                ? "line-through"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        -{" "}
                                                                    </span>
                                                                    <span
                                                                        className={`${
                                                                            task.isCompleted
                                                                                ? "line-through"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {task.priority.toLocaleUpperCase()}
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    );
                                },
                            }}
                        />
                    </TooltipProvider>
                </div>
                <div className="w-2/3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Done</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={task.isCompleted}
                                            onCheckedChange={(checked: any) =>
                                                handleToggleComplete(
                                                    task.id,
                                                    checked as boolean
                                                )
                                            }
                                            disabled={task.isCompleted}
                                        />
                                    </TableCell>
                                    <TableCell
                                        className={`${
                                            task.isCompleted
                                                ? "line-through"
                                                : ""
                                        }`}
                                    >
                                        {task.name}
                                    </TableCell>
                                    <TableCell
                                        className={`${
                                            task.isCompleted
                                                ? "line-through"
                                                : ""
                                        }`}
                                    >
                                        {task.description}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={task.priority}
                                            onValueChange={(
                                                value: "low" | "medium" | "high"
                                            ) =>
                                                handleUpdatePriority(
                                                    task.id,
                                                    value
                                                )
                                            }
                                            disabled={task.isCompleted}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    handleEditTask(task)
                                                }
                                                disabled={task.isCompleted}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTask ? "Edit Task" : "Create a task"} for{" "}
                            {selectedDate?.toDateString()}
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                className="bg-background text-foreground"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                {...register("description")}
                                className="bg-background text-foreground"
                            />
                        </div>
                        {!editingTask && (
                            <div>
                                <Label htmlFor="priority">Priority</Label>
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="bg-background text-foreground">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.priority && (
                                    <p className="text-sm text-destructive">
                                        {errors.priority.message}
                                    </p>
                                )}
                            </div>
                        )}
                        <Button type="submit">
                            {editingTask ? "Update" : "Create"} Task
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
