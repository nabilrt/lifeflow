"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("categories", {
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
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("categories");
    },
};
