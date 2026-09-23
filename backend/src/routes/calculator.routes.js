const express = require("express");
const router = express.Router();
const calculatorController = require("../controllers/calculator.controller");

router.post("/evaluate", calculatorController.evaluate);
router.post("/matrix", calculatorController.matrix);
router.post("/convert", calculatorController.convert);
router.post("/graph", calculatorController.graph);

router.get("/history", calculatorController.getHistory);
router.delete("/history/:id", calculatorController.deleteHistoryItem);
router.delete("/history", calculatorController.clearHistory);

module.exports = router;
