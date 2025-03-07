const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Middleware to upload a file to GridFS
const uploadFile = (req, res, next) => {
  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  const { buffer, originalname, mimetype } = req.file;

  const uploadStream = bucket.openUploadStream(originalname, {
    contentType: mimetype,
  });

  uploadStream.end(buffer, (error) => {
    if (error) {
      return next(error);
    }

    req.file.id = uploadStream.id; // Attach the file ID to the request
    next();
  });
};

module.exports = { upload, uploadFile };