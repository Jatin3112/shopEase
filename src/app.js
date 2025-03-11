import express from "express";
import morganLogger from "./utils/morganLogger.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Use morgan logger here
app.use(morganLogger());

// Import routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import userRouter from "./routes/users.routes.js";
import productsRouter from "./routes/products.routes.js";
import ordersRouter from "./routes/orders.routes.js";

// Routes
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);

export { app };
