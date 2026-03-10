import app from "./config/server-config.js";
import userRouter from "./router/user-router.js"
import blogRouter from "./router/blog-router.js"
import path from "path";

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter)

// SPA fallback - serve index.html for any non-API routes
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(process.cwd(), "../frontend/dist/index.html"));
});

export default app;