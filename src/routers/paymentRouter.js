import { Router } from "express";
import PaymentController from "../controllers/PaymentController.js";

const paymentRouter = new Router();

paymentRouter.post("/secret", PaymentController.secret);
paymentRouter.post("/confirm-payment", PaymentController.confirmPayment);

export default paymentRouter;
