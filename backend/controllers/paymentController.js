require('dotenv').config();
const paypal = require('@paypal/checkout-server-sdk');
const client = require('../config/paypal');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paypalCreateOrder = async (req, res) => {
    try {
        const { total, items } = req.body;

        if (!total || !items?.length) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");

        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: total.toString(),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: total.toString()
                        }
                    }
                },
                items: items.map(item => ({
                    name: item.name.substring(0, 127),
                    quantity: item.quantity.toString(),
                    unit_amount: {
                        currency_code: 'EUR',
                        value: item.price.toString()
                    },
                }))
            }],
            application_context: {
                brand_name: 'ZUM ECKSCHE',
                user_action: 'PAY_NOW',
                locale: 'de-DE'
            }
        });

        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        console.error('PayPal create order error:', err);
        res.status(500).json({
            error: 'Failed to create PayPal order',
            details: err.message
        });
    }
};

const paypalCaptureOrder = async (req, res) => {
    try {
        const { orderID, orderData } = req.body;

        // 1. Capture payment
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const capture = await client.execute(request);

        // 2. Prepare order data with PayPal IDs
        const savedOrder = {
            ...orderData,
            status: 'paid',
            paypalOrderId: orderID,
            paypalTransactionId: capture.result.purchase_units[0].payments.captures[0].id,
            createdAt: new Date()
        };

        res.json({
            success: true,
            details: capture.result,
            order: savedOrder
        });

    } catch (err) {
        console.error('PayPal capture error:', err);
        res.status(500).json({
            error: 'Failed to capture payment',
            details: err.message
        });
    }
};


const stripeCreateOrder = async (req, res) => {
    try {
        const { amount, currency, metadata } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['giropay'],
            metadata,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe order creation failed:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    paypalCreateOrder,
    paypalCaptureOrder,
    stripeCreateOrder
};  