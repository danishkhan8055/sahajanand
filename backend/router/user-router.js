import {Router} from "express"
import { deleteUser, getAllUsers, login, register, updateUser } from "../controller/user-controller.js"
import { isAdmin } from "../middleware/isAdmin.js";
import { auth } from "../middleware/auth.js";

const router = Router()

router.post("/register",register);
router.post("/login",login);
router.get("/get-user",auth , isAdmin,getAllUsers)
router.delete("/delete/:id",auth , isAdmin,deleteUser);
router.patch("/update/:id",auth , isAdmin,updateUser)

export default router;