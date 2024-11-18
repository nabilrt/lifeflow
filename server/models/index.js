const User = require("./users");
const Category = require("./category");
const Transaction = require("./transactions");
const Task = require("./task");
const Tour = require("./tour");

// User has many Transactions
User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userId" });

// Category has many Transactions
Category.hasMany(Transaction, {
    foreignKey: "categoryId",
    onDelete: "CASCADE",
});
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });
// User has many Tours
User.hasMany(Tour, { foreignKey: "userId", onDelete: "CASCADE" });
Tour.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Category, Transaction, Task, Tour };
