"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("tours", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            place: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            budget: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            isCompleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            images: {
                type: Sequelize.JSON, // Use JSON here
                allowNull: true,
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
        await queryInterface.dropTable("tours");
    },
};
