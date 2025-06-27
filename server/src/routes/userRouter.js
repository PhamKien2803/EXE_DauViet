const express = require("express");
const router = express.Router();

const {getInformationAccount, loginAccount, logoutAccount, register} = require("../controllers/userController");

const verifyToken = require("../middlewares/verifyToken");


router.post("/login",loginAccount);
router.post("/register", register);
router.post("/logout", verifyToken, logoutAccount);
router.get("/me", verifyToken, getInformationAccount)

module.exports = router;