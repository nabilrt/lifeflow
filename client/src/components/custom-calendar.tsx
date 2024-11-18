import { useState, useMemo } from "react";
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
import { useForm } from "react-hook-form";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

type Task = {
    date: Date;
    title: string;
    description: string;
    priority: string;
};

export function CustomCalendarComponent() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    const { register, handleSubmit, reset } = useForm<Task>();

    const onSubmit = (data: Task) => {
        if (!selectedDate) {
            toast({
                title: "Error",
                description: "Please select a date before adding a task.",
                variant: "destructive",
            });
            return;
        }
        setTasks([...tasks, { ...data, date: selectedDate }]);
        setIsDialogOpen(false);
        reset();
        toast({
            title: "Task added",
            description: `Task "${
                data.title
            }" added for ${selectedDate.toDateString()}`,
        });
    };

    const handleDateClick = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    const taskDates = useMemo(() => {
        return tasks.reduce((acc, task) => {
            const dateString = task.date.toDateString();
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
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderRadius: "100%",
        },
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TooltipProvider>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateClick}
                            className="rounded-md border w-full"
                            modifiers={modifiers}
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
                                                    <ul className="list-disc pl-4">
                                                        {tasksForDay.map(
                                                            (task, index) => (
                                                                <li key={index}>
                                                                    {task.title}
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
                <div>
                    <h2 className="text-xl font-bold mb-4">All Tasks</h2>
                    <ul className="space-y-2">
                        {tasks.map((task, index) => (
                            <li key={index} className="bg-gray-100 p-2 rounded">
                                <strong>{task.date.toDateString()}:</strong>{" "}
                                {task.title} - {task.description}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            Create a task for{" "}
                            {selectedDate?.toDateString() || "Selected Date"}
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...register("title", { required: true })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                {...register("description")}
                            />
                        </div>
                        <Button type="submit">Create Task</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
