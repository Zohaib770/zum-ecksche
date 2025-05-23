require('dotenv').config();
const nodemailer = require("nodemailer");

// Hostinger SMTP settings
const transporter = nodemailer.createTransport({
    host: "mail.yourdomain.com", // Replace with your domain
    port: 465, // SSL port
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SENDER_MAIL, // Your Hostinger email
        pass: process.env.SENDER_MAIL_PASS, // Password you set in Hostinger
    },
});

// Function to send order confirmation
const sendOrderConfirmation = async (order, userEmail) => {
    try {
        await transporter.sendMail({
            from: process.env.SENDER_MAIL, // Sender
            to: userEmail, // Customer email
            subject: `Bestellbestätigung  #${order._id}`, // Subject
            html: `
                <h2>Vielen Dank für Ihre Bestellung!</h2>
                <p>Bestellnummer: <strong>${order._id}</strong></p>
                <h3>Ihre Artikel:</h3>
                <ul>
                    ${order.cartItem.map(item => `
                    <li>${item.quantity}x ${item.name} - ${item.price}€</li>
                    `).join('')}
                </ul>
                <p><strong>Gesamtbetrag: ${order.price}€</strong></p>
    `,
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Email error:", error);
    }
};

module.exports = { sendOrderConfirmation };