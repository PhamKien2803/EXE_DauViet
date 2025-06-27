const express = require("express");
const router = express.Router();
const uploadImageController = require("../controllers/uploadImageController");
const useController = require("../controllers/useController");
const verifyToken = require("../middlewares/verifyToken");
const Product = require("../models/productModel");

router.post('/upload', verifyToken, uploadImageController.uploadImage, uploadImageController.handleUpload);
router.get('/',useController.findGenericActive(Product, "Product"));
router.get("/:id",useController.findIdGeneric(Product, "Product"));
router.post('/', verifyToken, useController.createGeneric(Product, "Product"));
router.put("/:id", verifyToken, useController.deletedSoftGeneric(Product));
router.put("/product-update/:id", verifyToken, useController.updateGeneric(Product, "Product"));

module.exports = router;


