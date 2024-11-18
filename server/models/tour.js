const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Tour = sequelize.define(
    "Tour",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        place: { type: DataTypes.STRING, allowNull: false },
        budget: { type: DataTypes.FLOAT, allowNull: false },
        isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
        images: {
            type: DataTypes.JSON, // Use JSON instead of ARRAY
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: "users", key: "userId" },
            allowNull: false,
        },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: "tours",
        timestamps: false,
    }
);

// Define relationships
Tour.associate = (models) => {
    Tour.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Tour;
