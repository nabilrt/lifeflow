"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            userId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            passwordHistory: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            avatar: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            walletBalance: {
                type: Sequelize.DOUBLE,
                defaultValue: 0.0,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("users");
    },
};
