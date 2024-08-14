import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jobRouter from "./src/routers/jobRouter.js";
import authRouter from "./src/routers/authRouter.js";
import cors from "cors";
import Stripe from "stripe";
import resumeRouter from "./src/routers/resumeRouter.js";
import contactRouter from "./src/routers/contactRouter.js";

dotenv.config();

const stripeApiKey = process.env.STRIPE_API_KEY;
const dbURL = process.env.DB_URL;
const PORT = 8080;
const app = express();
const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", jobRouter);
app.use("/api", authRouter);
app.use("/api", resumeRouter);
app.use("/api", contactRouter);

app.get("/", (res) => {
	res.send("Express on Vercel");
});

// STRIPE
const stripe = new Stripe(stripeApiKey);

app.post("/secret", async (req, res) => {
	const { amount, currency, payment_method_types } = req.body;
	try {
		const intent = await stripe.paymentIntents.create({
			amount: amount,
			currency: currency,
			payment_method_types: [payment_method_types],
			metadata: { integration_check: "accept_a_payment" },
		});
		res.json({
			client_secret: intent.client_secret,
			paymentIntentId: intent.id,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.post("/confirm-payment", async (req, res) => {
	try {
		const { client_secret, paymentIntentId } = req.body;

		const paymentIntent = await stripe.paymentIntents.confirm(client_secret, paymentIntentId);

		if (paymentIntent.status === "succeeded") {
			res.status(200).json({ success: true, message: "Payment completed successfully" });
		} else {
			res.status(400).json({ success: false, message: "Payment failed" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: error.message });
	}
});

async function startApp() {
	try {
		await mongoose.connect(dbURL);
		app.listen(PORT, () => console.log("Server started" + " " + PORT));
	} catch (e) {
		console.log(e);
	}
}

await startApp();
