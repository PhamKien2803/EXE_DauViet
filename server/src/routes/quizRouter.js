const express = require("express");
const router = express.Router();
const useController = require("../controllers/useController");
const verifyToken = require("../middlewares/verifyToken");
const Quiz = require("../models/quizModel");


router.get("/", useController.findGenericActive(Quiz, "Quiz"));
router.get("/:id", useController.findIdGeneric(Quiz, "Quiz"));
router.post("/", useController.createGeneric(Quiz, "Quiz"));
router.put("/quiz/:id", useController.updateGeneric(Quiz, "Quiz"));
router.put("/:id", useController.deletedSoftGeneric(Quiz, "Quiz"));


module.exports = router;

