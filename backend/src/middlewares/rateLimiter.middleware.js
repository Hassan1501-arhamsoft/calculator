const rateLimit = require("express-rate-limit");

// Generous enough for real use (button-tap-speed typing) while still
// blocking scripted abuse of the eval-ish /evaluate endpoint.
const calculatorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests — slow down and try again shortly." },
});

module.exports = calculatorLimiter;
