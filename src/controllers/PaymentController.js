import Stripe from "stripe";
const stripeApiKey = process.env.STRIPE_API_KEY;

const stripe = new Stripe(stripeApiKey);

class PaymentController {
	async confirmPayment(req, res) {
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
	}

	async secret(req, res) {
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
	}
}

export default new PaymentController();
