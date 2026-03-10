import express from "express";
import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} from "../controller/blog-controller.js";
import { upload } from "../middleware/multer.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/get", getBlogs);
router.get("/:id", getBlogs);

router.post("/create", auth, upload.single("image"), createBlog);

router.put("/update/:id", auth, isAdmin, upload.single("image"), updateBlog);

router.delete("/delete/:id", auth, isAdmin, deleteBlog);

export default router;