const multer = require('multer');

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Specify file limits, if needed
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

// Export the configured Multer instance
module.exports = upload;
