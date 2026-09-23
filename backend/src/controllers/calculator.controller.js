const calculatorService = require("../services/calculator.service");
const Calculation = require("../models/calculation.model");

// Saves a history entry only when the request carries a device id.
// The calculator itself always works; history is a bonus.
async function saveHistory({ deviceId, type, expression, result, meta }) {
  if (!deviceId) return null;
  try {
    return await Calculation.create({ deviceId, type, expression, result, meta });
  } catch (err) {
    // History is a convenience, not the primary function — never fail
    // the calculation itself because saving the log failed.
    console.error("Failed to save calculation history:", err.message);
    return null;
  }
}

exports.evaluate = async (req, res, next) => {
  try {
    const { expression } = req.body;
    const { result } = calculatorService.evaluateExpression(expression);
    await saveHistory({ deviceId: req.deviceId, type: "scientific", expression, result });
    res.json({ success: true, expression, result });
  } catch (err) {
    next(Object.assign(err, { status: 400 }));
  }
};

exports.matrix = async (req, res, next) => {
  try {
    const { operation, matrixA, matrixB } = req.body;
    const { result, resultDisplay } = calculatorService.matrixOperation({ operation, matrixA, matrixB });
    await saveHistory({
      deviceId: req.deviceId,
      type: "matrix",
      expression: `${operation}(${JSON.stringify(matrixA)}${matrixB ? `, ${JSON.stringify(matrixB)}` : ""})`,
      result: resultDisplay,
      meta: { operation, matrixA, matrixB, result },
    });
    res.json({ success: true, operation, result, resultDisplay });
  } catch (err) {
    next(Object.assign(err, { status: 400 }));
  }
};

exports.convert = async (req, res, next) => {
  try {
    const { category, from, to, value } = req.body;
    const { result } = calculatorService.convertUnit({ category, from, to, value: Number(value) });
    await saveHistory({
      deviceId: req.deviceId,
      type: "conversion",
      expression: `${value} ${from} -> ${to}`,
      result: String(result),
      meta: { category, from, to, value },
    });
    res.json({ success: true, result });
  } catch (err) {
    next(Object.assign(err, { status: 400 }));
  }
};

exports.graph = async (req, res, next) => {
  try {
    const { expression, xMin, xMax, steps } = req.body;
    const data = calculatorService.generateGraphData({
      expression,
      xMin: xMin !== undefined ? Number(xMin) : undefined,
      xMax: xMax !== undefined ? Number(xMax) : undefined,
      steps: steps !== undefined ? Number(steps) : undefined,
    });
    await saveHistory({
      deviceId: req.deviceId,
      type: "graph",
      expression,
      result: `${data.points.length} points`,
      meta: { xMin, xMax, steps },
    });
    res.json({ success: true, ...data });
  } catch (err) {
    next(Object.assign(err, { status: 400 }));
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    if (!req.deviceId) return res.json({ success: true, items: [] });
    const items = await Calculation.find({ deviceId: req.deviceId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

exports.deleteHistoryItem = async (req, res, next) => {
  try {
    await Calculation.deleteOne({ _id: req.params.id, deviceId: req.deviceId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.clearHistory = async (req, res, next) => {
  try {
    await Calculation.deleteMany({ deviceId: req.deviceId });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
