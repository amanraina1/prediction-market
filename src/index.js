import express from "express";
import { config } from "dotenv";
import { veriyAuth } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.route.js";
import marketRoutes from "./routes/market.route.js";

config();

const app = express();
app.use(express.json({}));

const PORT = process.env.PORT || 3001;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/market", veriyAuth, marketRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`)
})