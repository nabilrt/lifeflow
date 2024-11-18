const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category = sequelize.define(
    "Category",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: "users", key: "userId" },
            allowNull: false,
        },
    },
    {
        tableName: "categories",
        timestamps: false,
    }
);

// Define relationships
Category.associate = (models) => {
    Category.belongsTo(models.User, { foreignKey: "userId" });
    Category.hasMany(models.Transaction, {
        foreignKey: "categoryId",
        onDelete: "CASCADE",
    });
};

module.exports = Category;
