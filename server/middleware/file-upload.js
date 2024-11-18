const multer = require("multer");
const storage = multer.diskStorage({
    destination: "uploads/", // Temporary folder for uploads
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const singleUpload = multer({ storage }).single("file");

module.exports = singleUpload;
