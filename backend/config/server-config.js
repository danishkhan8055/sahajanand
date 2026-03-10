import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import path from "path";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import { createDefaultAdmin } from "../middleware/defaultAdmin.js";
import userRouter from "../router/user-router.js";
import blogRouter from "../router/blog-router.js";

config();
const app = express();

const corsOption = {
  origin: ["http://localhost:5000", "http://localhost:5173" ['http://3.111.0.97']],
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(morgan("dev"));
app.use(limiter);
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(process.cwd(), "../frontend/dist")));

app.use("/user", userRouter);   // ⭐ IMPORTANT
app.use("/blog", blogRouter);   // ⭐ IMPORTANT

connectDB();
await createDefaultAdmin();

export default app;