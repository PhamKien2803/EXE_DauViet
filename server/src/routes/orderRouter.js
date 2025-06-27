const express = require("express");
const router = express.Router();
const useController = require("../controllers/useController");
const verifyToken = require("../middlewares/verifyToken");
const Order = require("../models/orderModel");


router.get("/", verifyToken, useController.findGenericActive(Order, "Order"));
router.get("/:id", verifyToken, useController.findIdGeneric(Order, "Order"));
router.get("/user/:id", verifyToken, useController.findUserIdGeneric(Order, "Order", "products.product"));
router.post("/", verifyToken, useController.createGeneric(Order, "Order"));
router.put("/order-update/:id", verifyToken, useController.updateGeneric(Order, "Order"));
router.put("/:id", verifyToken, useController.deletedSoftGeneric(Order, "Order"));


module.exports = router;