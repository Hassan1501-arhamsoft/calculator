const mongoose = require("mongoose");

/**
 * Stores one calculator action so a user can revisit their work.
 * There's no login system here — the frontend generates a random
 * `deviceId` on first visit and stores it in localStorage, and that's
 * what history is scoped by. Swap this for a real `user` ref if you
 * add authentication later.
 */
const calculationSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["basic", "scientific", "matrix", "conversion", "graph"],
      required: true,
    },
    // Human-readable input, e.g. "sin(45) + 2^3" or "12 km -> mi"
    expression: {
      type: String,
      required: true,
    },
    // Human-readable output, kept as a string so matrices and
    // multi-line results don't need a separate field per type.
    result: {
      type: String,
      required: true,
    },
    // Optional structured payload (matrix values, graph range, etc.)
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  { timestamps: true }
);

calculationSchema.index({ deviceId: 1, createdAt: -1 });

module.exports = mongoose.model("Calculation", calculationSchema);
