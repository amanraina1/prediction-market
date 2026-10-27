import express from "express";
import { config } from "dotenv";
import { veriyAuth } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.route.js";
import marketRoutes from "./routes/market.route.js";
import betRoutes from "./routes/bet.route.js";
import extraRoutes from "./routes/extra.route.js";
import resolveRoutes from "./routes/resolve.route.js";

config();

const app = express();
app.use(express.json({}));

const PORT = process.env.PORT || 3001;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/market", veriyAuth, marketRoutes);
app.use("/api/v1/bet", veriyAuth, betRoutes);
app.use("/api/v1/", veriyAuth, extraRoutes);
app.use("/api/v1/resolve", verifyAdmin, resolveRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`)
})