import { Router } from "express";
import { check } from "express-validator";
import AuthController from "../controllers/AuthController.js";

const authRouter = new Router();

authRouter.post(
	"/register",
	[
		check("username", "Please Enter a Valid Username").not().isEmpty(),
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a valid password").isLength({
			min: 6,
		}),
	],
	AuthController.register,
);

authRouter.post(
	"/login",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a valid password").isLength({
			min: 6,
		}),
	],
	AuthController.login,
);
authRouter.get("/users", AuthController.getAll);
authRouter.delete("/users/:id", AuthController.remove);
authRouter.get("/users/:id", AuthController.getById);

export default authRouter;
