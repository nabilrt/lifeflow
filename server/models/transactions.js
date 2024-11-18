const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: { model: "categories", key: "id" },
            allowNull: false,
        },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        type: { type: DataTypes.ENUM("debit", "credit"), allowNull: false },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: "users", key: "userId" },
            allowNull: false,
            field: "userId", // Explicitly tells Sequelize the database field name
        },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: "transactions",
        timestamps: false,
    }
);

// Define relationships
Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "userId" });
    Transaction.belongsTo(models.Category, { foreignKey: "categoryId" });
};

module.exports = Transaction;
