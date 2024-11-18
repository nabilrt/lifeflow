"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("transactions", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "categories",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            amount: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM("debit", "credit"),
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "userId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("transactions");
    },
};
