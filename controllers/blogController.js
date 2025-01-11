const multer = require("multer");
const sharp = require("sharp");
const { adminStorage } = require("../config/firebase");

// Set up multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to handle file upload to Firebase Storage
const uploadFile = async (file) => {
  try {
    const bucket = adminStorage.bucket();
    const fileExtension = file.originalname.split('.').pop();
    const filePath = `vk_mishra/${Date.now()}_${file.originalname}`;
    const firebaseFile = bucket.file(filePath);

    // Check file type (image or video) based on mimetype
    if (file.mimetype.startsWith("image/")) {
      // Process image using sharp
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(1150, 652, { fit: "cover" })
        .toFormat("png")
        .toBuffer();

      const blobStream = firebaseFile.createWriteStream({
        metadata: {
          contentType: "image/png",
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (error) => {
          reject(error);
        });

        blobStream.on("finish", async () => {
          const [url] = await firebaseFile.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          resolve({ blogImage: url }); // Return blogImage field for images
        });

        blobStream.end(resizedImageBuffer);
      });
    } else if (file.mimetype.startsWith("video/")) {
      // Upload video directly
      const blobStream = firebaseFile.createWriteStream({
        metadata: {
          contentType: file.mimetype, // Set correct video content type
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (error) => {
          reject(error);
        });

        blobStream.on("finish", async () => {
          const [url] = await firebaseFile.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          resolve({ videoUrl: url }); // Return videoUrl field for videos
        });

        blobStream.end(file.buffer);
      });
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    throw new Error("Error uploading file: " + error.message);
  }
};

module.exports = {
  uploadFile,
  upload,
};
