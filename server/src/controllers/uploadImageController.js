const Product = require("../models/productModel");
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'demo_uploads', // Thư mục lưu trên Cloudinary (tùy bạn đổi)
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const parser = multer({ storage: storage });

// Controller trả về middleware upload
exports.uploadImage = parser.array('images', 5);

// Controller xử lý request upload
exports.handleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(200).json({
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};
