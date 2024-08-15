import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jobRouter from "./src/routers/jobRouter.js";
import authRouter from "./src/routers/authRouter.js";
import cors from "cors";
import resumeRouter from "./src/routers/resumeRouter.js";
import contactRouter from "./src/routers/contactRouter.js";

dotenv.config();

const dbURL = process.env.DB_URL;
const PORT = 8080;
const app = express();
const corsOptions = {
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};
app.get("/", (res) => {
	res.send("Express on Vercel");
});
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", jobRouter);
app.use("/api", authRouter);
app.use("/api", resumeRouter);
app.use("/api", contactRouter);
// STRIPE
app.use("/api", paymentRouter);

async function main() {
	try {
		await mongoose.connect(dbURL);
		app.listen(PORT, () => console.log("Server started" + " " + PORT));
	} catch (e) {
		console.log(e);
	}
}

await main();
