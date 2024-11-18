const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkLogin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth Failed",
        });
    }
};

module.exports = checkLogin;
