import { validationResult } from "express-validator";
import Users from "../schemas/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class AuthController {
	async getAll(req, res) {
		try {
			const users = await Users.find({});
			res.status(201).json({
				status: "success",
				message: users,
			});
		} catch (error) {
			res.status(404).json({
				status: "fail",
				message: error.message,
			});
		}
	}

	async remove(req, res) {
		const { id } = req.params;
		try {
			const user = await Users.findByIdAndDelete(id);
			res.status(201).json({
				status: "success",
				message: user,
			});
		} catch (error) {
			res.status(404).json({
				statsu: "fail",
				message: error.message,
			});
		}
	}

	async register(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { username, email, password } = req.body;
		try {
			let user = await Users.findOne({
				email,
			});
			if (user) {
				return res.status(409).json({
					msg: "User Already Exists",
				});
			}

			user = new Users({
				username,
				email,
				password,
			});
			//user hashed password will be done upon saving as described in the schema.
			await user.save();

			const payload = {
				user: {
					id: user.id,
					name: user.username,
					email: user.email,
					password: user.password,
				},
			};

			jwt.sign(
				payload,
				"randomString",
				{
					expiresIn: "48h",
				},
				(err, token) => {
					if (err) throw err;

					res.status(200).json({
						user,
						token,
					});
				},
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send("Error in Saving");
		}
	}

	async login(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const { email, password } = req.body;
		try {
			let user = await Users.findOne({
				email,
			});
			if (!user)
				return res.status(400).json({
					message: "User does not exist",
				});

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({
					message: "Incorrect Password!",
				});

			const payload = {
				user: {
					id: user.id,
					name: user.username,
					email: user.email,
					password: user.password,
				},
			};

			jwt.sign(
				payload,
				"randomString",
				{
					expiresIn: 3600,
				},
				(err, token) => {
					if (err) throw err;
					res.status(200).json({
						token,
						user: {
							username: user.username,
							email: user.email,
						},
					});
				},
			);
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: "Server Error",
			});
		}
	}
}

export default new AuthController();
