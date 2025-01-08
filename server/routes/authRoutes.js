import expres from "express";
import { userRegister, loginUser } from "../controllers/authControllers.js";

const router = expres.Router();

router.post("/register", userRegister);
router.post("/login", loginUser);

export default router;
