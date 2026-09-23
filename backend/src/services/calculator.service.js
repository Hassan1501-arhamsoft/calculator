const { create, all } = require("mathjs");

// A scoped mathjs instance, not the global one — keeps this module's
// behavior predictable even if something else configures mathjs later.
const math = create(all, {});

// mathjs's default parser already refuses to reach outside its own
// sandbox (no Node globals, no `import`, no assignment to protected
// names), which is what makes it safe to evaluate user-typed strings
// directly instead of using eval().

/**
 * Evaluate a single scientific expression, e.g. "sin(45 deg) + 2^3".
 */
function evaluateExpression(expression) {
  if (typeof expression !== "string" || !expression.trim()) {
    throw new Error("Expression is required");
  }
  let result;
  try {
    result = math.evaluate(expression);
  } catch (err) {
    throw new Error(`Could not evaluate expression: ${err.message}`);
  }
  if (typeof result === "function") {
    throw new Error("Expression did not resolve to a value");
  }
  return {
    expression,
    result: math.format(result, { precision: 12 }),
  };
}

const MATRIX_OPS = ["add", "subtract", "multiply", "inverse", "determinant", "transpose"];

/**
 * Run one matrix operation. `inverse`, `determinant` and `transpose`
 * only use matrixA; the rest need both.
 */
function matrixOperation({ operation, matrixA, matrixB }) {
  if (!MATRIX_OPS.includes(operation)) {
    throw new Error(`Unsupported matrix operation: ${operation}`);
  }
  if (!Array.isArray(matrixA)) {
    throw new Error("matrixA is required");
  }

  const A = math.matrix(matrixA);
  let result;

  switch (operation) {
    case "inverse":
      result = math.inv(A);
      break;
    case "determinant":
      result = math.det(A);
      break;
    case "transpose":
      result = math.transpose(A);
      break;
    case "add":
    case "subtract":
    case "multiply": {
      if (!Array.isArray(matrixB)) {
        throw new Error("matrixB is required for this operation");
      }
      const B = math.matrix(matrixB);
      result = math[operation](A, B);
      break;
    }
    default:
      throw new Error(`Unsupported matrix operation: ${operation}`);
  }

  const value = math.isMatrix(result) ? result.toArray() : result;
  return {
    operation,
    result: value,
    resultDisplay: math.format(result, { precision: 8 }),
  };
}

// A small, explicit conversion table rather than a generic units call,
// so unsupported categories fail clearly instead of silently.
const UNIT_CATEGORIES = ["length", "mass", "temperature", "area", "volume", "time", "speed", "data"];

function convertUnit({ category, from, to, value }) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("value must be a number");
  }
  if (!UNIT_CATEGORIES.includes(category)) {
    throw new Error(`Unsupported category: ${category}`);
  }

  if (category === "temperature") {
    return { result: convertTemperature(value, from, to) };
  }

  try {
    const converted = math.unit(value, from).toNumber(to);
    return { result: converted };
  } catch (err) {
    throw new Error(`Could not convert ${from} to ${to}: ${err.message}`);
  }
}

function convertTemperature(value, from, to) {
  const toCelsius = {
    C: (v) => v,
    F: (v) => ((v - 32) * 5) / 9,
    K: (v) => v - 273.15,
  };
  const fromCelsius = {
    C: (v) => v,
    F: (v) => (v * 9) / 5 + 32,
    K: (v) => v + 273.15,
  };
  if (!toCelsius[from] || !fromCelsius[to]) {
    throw new Error(`Unsupported temperature unit: ${from} or ${to}`);
  }
  const celsius = toCelsius[from](value);
  return fromCelsius[to](celsius);
}

/**
 * Sample a function of x across a range so the frontend can plot it
 * without shipping a math parser to the browser.
 */
function generateGraphData({ expression, xMin = -10, xMax = 10, steps = 200 }) {
  if (typeof expression !== "string" || !expression.trim()) {
    throw new Error("Expression is required");
  }
  if (xMin >= xMax) {
    throw new Error("xMin must be less than xMax");
  }
  const clampedSteps = Math.min(Math.max(steps, 10), 2000);

  let compiled;
  try {
    compiled = math.compile(expression);
  } catch (err) {
    throw new Error(`Could not parse expression: ${err.message}`);
  }

  const points = [];
  const step = (xMax - xMin) / clampedSteps;
  for (let i = 0; i <= clampedSteps; i++) {
    const x = xMin + i * step;
    let y;
    try {
      y = compiled.evaluate({ x });
    } catch {
      y = null; // undefined at this x (e.g. tan asymptote, sqrt of negative)
    }
    if (typeof y !== "number" || !Number.isFinite(y)) y = null;
    points.push({ x, y });
  }
  return { expression, points };
}

module.exports = {
  evaluateExpression,
  matrixOperation,
  convertUnit,
  generateGraphData,
  MATRIX_OPS,
  UNIT_CATEGORIES,
};
