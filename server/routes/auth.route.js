import Router from "express";
import { loginUserController, logoutUserController, registerUserController, getUserProfile, updateProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutUserController);
authRouter.get("/getProfile", authMiddleware, getUserProfile);
authRouter.post("/updateProfile", authMiddleware, updateProfile);
// protected route example
authRouter.get("/me", authMiddleware, (req, res) => {
	// req.user is set by authMiddleware
	res.json({ success: true, user: req.user });
});

export default authRouter;