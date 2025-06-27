const express = require("express");
const router = express.Router();
const useController = require("../controllers/useController");
const { calculateScore } = require("../controllers/userScoreController");
const verifyToken = require("../middlewares/verifyToken");
const UserScore = require("../models/userScoresModel");

router.get("/", useController.findGenericActive(UserScore, "UserScore"));
router.get("/:id", useController.findIdGeneric(UserScore, "UserScore"));
router.post("/", useController.createGeneric(UserScore, "UserScore"));
router.put("/quiz/:id", useController.updateGeneric(UserScore, "UserScore"));
router.put("/:id", useController.deletedSoftGeneric(UserScore, "UserScore"));
router.post("/calculate-score", calculateScore);


module.exports = router;

