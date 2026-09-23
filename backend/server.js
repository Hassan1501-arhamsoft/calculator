require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Connect to MongoDB Atlas using your environment variable
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Calculator API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});