const { Sequelize } = require("sequelize");

require("dotenv").config();
// Replace with your PostgreSQL connection URI
const DATABASE_URL = process.env.DB_URL;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: "mysql",
    logging: false, // Disable logging for cleaner output
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
        },
    },
});

sequelize
    .authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) => console.error("Database connection error:", err));

module.exports = sequelize;
