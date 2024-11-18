const multer = require("multer");
const storage = multer.diskStorage({
    destination: "uploads/", // Local temporary folder for uploads
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage }).array("files", 10); // Limit: 10 files

module.exports = upload;
