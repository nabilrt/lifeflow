import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  HandCoins,
  Ban,
  Badge,
  ArrowUpRight,
  ArrowBigDown,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Bar,
  BarChart,
  Pie,
  PieChart,
} from "recharts";
import { getMyTransactions, getUserAnalytics } from "@/lib/api";
import { useState, useEffect } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import CustomCalendar from "@/components/custom-calendar";
import NoContent from "@/components/NoContent";

// Define types for API response
type ExpenseBreakdown = {
  category: string;
  total: number;
};

type TaskPriority = {
  priority: string;
  count: number;
};

type IncomeExpenseTrend = {
  month: string;
  income: number;
  expense: number;
};

type UserAnalyticsData = {
  singleValues: {
    totalTransactions: number;
    totalIncome: number;
    totalExpense: number;
    completedTasks: number;
    incompleteTasks: number;
    completedTours: number;
    incompleteTours: number;
  };
  charts: {
    expenseBreakdownChart: ExpenseBreakdown[];
    tasksPriorityChart: TaskPriority[];
    incomeExpenseTrends: IncomeExpenseTrend[];
  };
};

type TransactionData = {
  id: number;
  categoryId: number;
  amount: number;
  type: "credit" | "debit";
  userId: number;
  createdAt: string;
  Category: {
    name: string;
  };
};

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<UserAnalyticsData | null>(
    null
  );
  const [transactionData, setTransactionData] = useState<
    TransactionData[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await getUserAnalytics();
        const responseV2 = await getMyTransactions();
        setAnalyticsData(response.data);
        setTransactionData(responseV2.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [isUpdated]);
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!analyticsData) {
    return (
      <NoContent>
        <div>
          <h1 className="text-[1.4rem] mt-6 font-[500] text-black">
            Currently You Have No Analytics
          </h1>

          <p className="text-[0.9rem] text-gray-500">
            Create Something to see analytics
          </p>
        </div>
      </NoContent>
    );
  }

  const {
    charts: { incomeExpenseTrends, expenseBreakdownChart, tasksPriorityChart },
    singleValues: { totalIncome, totalExpense, incompleteTasks },
  } = analyticsData;

  // Line Chart Config
  const lineChartConfig: ChartConfig = {
    income: { label: "Income", color: "hsl(var(--chart-1))" },
    expense: { label: "Expense", color: "hsl(var(--chart-2))" },
  };

  const updatedTaskPriority = tasksPriorityChart.map((task, index) => ({
    ...task,
    fill: `hsl(var(--chart-${index + 1}))`, // Assign unique color
  }));

  const updatedExpenseBreakdownChart = expenseBreakdownChart.map(
    (expense, index) => ({
      ...expense,
      fill: `hsl(var(--chart-${index + 1}))`, // Assign unique color dynamically
    })
  );

  // Pie Chart Config for Task Priority
  const pieChartConfig: ChartConfig = {
    high: {
      label: "High",
      color: "hsl(var(--chart-1))",
    },
    medium: { label: "Medium", color: "hsl(var(--chart-2))" },
    low: { label: "Low", color: "hsl(var(--chart-3))" },
  };

  // Bar Chart Config for Expense Breakdown
  const barChartConfig: ChartConfig = expenseBreakdownChart.reduce(
    (acc, item, index) => {
      acc[item.category] = {
        label: item.category,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    },
    {} as ChartConfig
  );
  return (
    <div>
      <main className="flex  flex-grow flex-col gap-4 p-4 md:gap-8 md:p-8  ">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wallet Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalIncome - totalExpense).toLocaleString("en-US")}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalIncome.toLocaleString("en-US")}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expense
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalExpense.toLocaleString("en-US")}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Left</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{incompleteTasks}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense Trends</CardTitle>
              <CardDescription>Monthly trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={lineChartConfig}
                className="mx-auto aspect-square max-h-[310px]"
              >
                <LineChart
                  data={incomeExpenseTrends}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="income"
                    type="natural"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="expense"
                    type="natural"
                    stroke="var(--color-expense)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground">
                Income vs Expense analysis
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Priority</CardTitle>
              <CardDescription>Distribution of task priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[310px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={updatedTaskPriority}
                    dataKey="count"
                    nameKey="priority"
                    label={(entry) => `${entry.priority}: ${entry.count}`}
                    outerRadius={100}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground">
                Task distribution by priority
              </div>
            </CardFooter>
          </Card>

          <Card className="" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Recent transactions of yours.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="/user/finance">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="">Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                  {transactionData
                    ?.sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return dateB.getTime() - dateA.getTime(); // Explicitly use getTime()
                    })
                    .slice(0, 8)
                    .map((item) => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">
                              {item.Category.name}
                            </div>
                          </TableCell>
                          <TableCell className="">
                            {item.type.toUpperCase()}
                          </TableCell>

                          <TableCell className="text-right">
                            {item.amount.toLocaleString("en-US")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableHeader>
              </Table>
            </CardContent>
          </Card>

          {/* Pie Chart */}

          <Card>
            <CardHeader>
              <CardTitle>Category-wise Expenses</CardTitle>
              <CardDescription>
                Comparison of expenses across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={barChartConfig}
                className="mx-auto w-full aspect-square max-h-[310px]"
              >
                <BarChart
                  accessibilityLayer
                  data={updatedExpenseBreakdownChart}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={8} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="text-muted-foreground">
                Expenses visualized by category
              </div>
            </CardFooter>
          </Card>
          <div className="lg:col-span-2">
            <Card className="" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Task Calender</CardTitle>
                  <CardDescription>Manage Tasks from Calender</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <CustomCalendar
                  setIsUpdated={setIsUpdated}
                  isUpdated={isUpdated}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
