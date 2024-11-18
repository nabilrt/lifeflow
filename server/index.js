const express = require("express");
const routes = require("./router/router");
const cors = require("cors");
require("./db"); // Ensure the database connection is initialized
require("dotenv").config();

const app = express();
app.use(express.json()); // to handle JSON bodies

app.use(cors());

// Use routes
app.use("/api/v1", routes); // All routes will be prefixed with /api

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
