const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high"),
            allowNull: false,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: "users", key: "userId" },
            allowNull: false,
        },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: "tasks",
        timestamps: false,
    }
);

// Define relationships
Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Task;
