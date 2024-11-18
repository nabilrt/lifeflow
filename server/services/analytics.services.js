const { Category, Tour, Task, Transaction } = require("../models/index");

const analyticsService = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required for analytics.");
    }

    // Single Value Metrics
    const totalTransactions = await Transaction.count({ where: { userId } });
    const completedTasks = await Task.count({
        where: { userId, isCompleted: true },
    });
    const incompleteTasks = await Task.count({
        where: { userId, isCompleted: false },
    });
    const completedTours = await Tour.count({
        where: { userId, isCompleted: true },
    });
    const incompleteTours = await Tour.count({
        where: { userId, isCompleted: false },
    });

    const [incomeExpense] = await Transaction.sequelize.query(
        `
        SELECT
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE userId = :userId
    `,
        { replacements: { userId } }
    );

    console.log(incomeExpense);

    // Total Income and Expense
    const totalIncome = incomeExpense[0].total_income || 0;
    const totalExpense = incomeExpense[0].total_expense || 0;

    // Chart Data: Expense Breakdown by Category (Pie Chart)
    const expenseBreakdown = await Transaction.findAll({
        attributes: [
            [Category.sequelize.col("Category.name"), "category_name"],
            [
                Transaction.sequelize.fn(
                    "SUM",
                    Transaction.sequelize.col("amount")
                ),
                "total",
            ],
        ],
        where: { userId, type: "debit" },
        include: [{ model: Category, attributes: [] }], // Include Category model explicitly
        group: ["Category.id"], // Group by Category.id to ensure accurate joins
        raw: true,
    });

    const expenseBreakdownChart = expenseBreakdown.map((item) => ({
        category: item.category_name,
        total: item.total,
    }));

    // Chart Data: Tasks by Priority (Bar Chart)
    const tasksByPriority = await Task.findAll({
        attributes: [
            "priority",
            [Task.sequelize.fn("COUNT", Task.sequelize.col("id")), "count"],
        ],
        where: { userId },
        group: ["priority"],
        raw: true,
    });

    const tasksPriorityChart = tasksByPriority.map((item) => ({
        priority: item.priority,
        count: item.count,
    }));

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const monthlyTrends = await Transaction.sequelize.query(
        `
        SELECT
            DATE_FORMAT(createdAt, '%M %Y') AS month, -- Month name and year
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS income, -- Aggregate income
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS expense -- Aggregate expense
        FROM transactions
        WHERE userId = :userId
        GROUP BY DATE_FORMAT(createdAt, '%M %Y'), DATE_FORMAT(createdAt, '%Y-%m') -- Align grouping
        ORDER BY DATE_FORMAT(createdAt, '%Y-%m') ASC
        `,
        {
            replacements: { userId },
            type: Transaction.sequelize.QueryTypes.SELECT,
        }
    );

    const incomeExpenseTrends = monthlyTrends.map((item) => ({
        month: item.month, // Month name and year (e.g., "November 2024")
        income: item.income,
        expense: item.expense,
    }));
    return {
        singleValues: {
            totalTransactions,
            totalIncome,
            totalExpense,
            completedTasks,
            incompleteTasks,
            completedTours,
            incompleteTours,
        },
        charts: {
            expenseBreakdownChart,
            tasksPriorityChart,
            incomeExpenseTrends,
        },
    };
};

module.exports = { analyticsService };
