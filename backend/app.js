const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const deviceId = require("./src/middlewares/deviceId.middleware");
const rateLimiter = require("./src/middlewares/rateLimiter.middleware");
const { notFound, errorHandler } = require("./src/middlewares/error.middleware");
const calculatorRoutes = require("./src/routes/calculator.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" })); // matrices/graph ranges are small; no need for a big body limit
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(deviceId);

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/calculator", rateLimiter, calculatorRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
