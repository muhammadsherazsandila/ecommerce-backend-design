import "dotenv/config";

import { app } from "./app.js";
import { connectDB } from "./config/db.js";
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
});
