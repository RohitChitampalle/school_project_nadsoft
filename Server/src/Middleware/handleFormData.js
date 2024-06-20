const multer = require('multer');


// Set up Multer for file uploads
const multerConfig = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit (adjust as needed)
    },
});

module.exports = multerConfig