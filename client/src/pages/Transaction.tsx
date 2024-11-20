"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  getMyTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMyCategories,
  userDetails,
} from "@/lib/api/index";
import { useAuth } from "@/lib/context/auth-context";

const formSchema = z
  .object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(Number(val)), "Amount must be a number")
      .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
    category: z.string().optional(),
    newCategory: z.string().optional(),
    type: z.enum(["credit", "debit"], {
      required_error: "Transaction type is required",
    }),
  })
  .refine((data) => data.category || data.newCategory, {
    message: "Either select an existing category or create a new one",
    path: ["category"], // Error is shown on the category field
  });

type Transaction = {
  id: number;
  categoryId: number;
  amount: number;
  type: "credit" | "debit";
  userId: number;
  createdAt: string;
  Category?: {
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
  userId: number;
  Transactions: Transaction[];
};

export default function TransactionsComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [revertTransaction, setRevertTransaction] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { setUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      amount: "",
      category: "",
      newCategory: "",
      type: "debit",
    },
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getMyTransactions();
      setTransactions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getMyCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = {
        amount: parseFloat(values.amount),
        category: isNewCategory ? values.newCategory : Number(values.category),
        type: values.type,
      };

      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, formData);
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
        setIsUpdateDialogOpen(false);
      } else {
        await createTransaction(formData);
        toast({
          title: "Success",
          description: "Transaction created successfully",
        });
        setIsCreateDialogOpen(false);
      }
      fetchTransactions();
      fetchCategories();
      const userData = await userDetails();
      setUser(userData.data);
      localStorage.setItem("user", JSON.stringify(userData.data));
      form.reset();
      setIsNewCategory(false);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to submit transaction",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id, { revert: revertTransaction });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      const userData = await userDetails();
      setUser(userData.data);
      localStorage.setItem("user", JSON.stringify(userData.data));
      setIsDeleteDialogOpen(false);
      fetchTransactions();
      fetchCategories();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const openUpdateDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    form.reset({
      amount: transaction.amount.toString(),
      category: transaction.categoryId.toString(),
      newCategory: "",
      type: transaction.type,
    });
    setIsNewCategory(false);
    setIsUpdateDialogOpen(true);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRevertTransaction(false);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <Button
        onClick={() => {
          form.reset({
            amount: undefined,
            category: "",
            newCategory: "",
            type: "debit",
          });
          setIsCreateDialogOpen(true);
        }}
        className="mb-4"
      >
        Create Transaction
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions
            ?.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime(); // Explicitly use getTime()
            })
            .map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell className="uppercase">{transaction.type}</TableCell>
                <TableCell>{transaction.Category?.name}</TableCell>
                <TableCell>
                  {format(
                    new Date(transaction.createdAt),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(transaction)}
                    className="mr-2"
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(transaction)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog
        open={isCreateDialogOpen || isUpdateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsUpdateDialogOpen(false);
            setSelectedTransaction(null);
            form.reset();
            setIsNewCategory(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction
                ? "Update Transaction"
                : "Create Transaction"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              {!isNewCategory ? (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="newCategory"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>New Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter new category name"
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewCategory(!isNewCategory)}
                className="w-full"
              >
                {isNewCategory
                  ? "Select Existing Category"
                  : "Create New Category"}
              </Button>
              <FormField
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="debit">Debit</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="revert"
                checked={revertTransaction}
                onCheckedChange={(checked) =>
                  setRevertTransaction(checked as boolean)
                }
              />
              <label htmlFor="revert">Revert transaction</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedTransaction && handleDelete(selectedTransaction.id)
                }
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
