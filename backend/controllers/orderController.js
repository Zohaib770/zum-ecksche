const Order = require('../models/orderModel');
const { getIO } = require('../config/socket');
const { sendOrderConfirmation } = require("./emailController");

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    const saveorder = await newOrder.save();
    console.log("Bestellung erfolgreich gespeichert");
    sendOrderConfirmation(saveorder, req.body.personalDetail.email);
    const io = getIO(); // Rufe die initialisierte io-Instanz ab
    io.emit('newOrder', newOrder);
    res.status(201).json({ message: 'Bestellung erfolgreich gespeichert', order: newOrder });
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    res.status(500).json({ message: 'Fehler beim Speichern der Bestellung', error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;

  if (!orderId || !newStatus) {
    return res.status(400).json({ message: 'Bestell-ID und neuer Status sind erforderlich.' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: `Bestellung mit ID ${orderId} nicht gefunden.` });
    }

    console.log("bestellung status updated")
    res.json(updatedOrder);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bestellstatus:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Bestellstatus.', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};