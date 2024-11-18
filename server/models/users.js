const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
    "User",
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, unique: true, allowNull: false },
        passwordHistory: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        avatar: { type: DataTypes.STRING, unique: true, allowNull: true },
        walletBalance: {
            type: DataTypes.DOUBLE,
            defaultValue: 0.0,
        },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: "users",
        timestamps: false,
    }
);

// Define relationships
User.associate = (models) => {
    User.hasMany(models.Transaction, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(models.Category, {
        foreignKey: "userId",
        onDelete: "CASCADE",
    });
    User.hasMany(models.Tour, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasMany(models.Task, { foreignKey: "userId", onDelete: "CASCADE" });
};

module.exports = User;
