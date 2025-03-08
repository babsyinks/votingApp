const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Multer Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',  // Cloudinary folder name
        format: async (req, file) => 'png', // Convert all images to PNG
        public_id: (req, file) => `${Date.now()}_${file.originalname.split('.')[0]}`, // Create unique filename
        transformation: [{ width: 300, height: 300, crop: 'fill' }], // Resize to 300x300
    },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
