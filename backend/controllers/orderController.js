import Order from '../models/Order';

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ message: 'Bestellung erfolgreich gespeichert', order: newOrder });
    console.error('Bestellung erfolgreich');
  } catch (error) {
    console.error('Fehler beim Erstellen der Bestellung:', error);
    res.status(500).json({ message: 'Fehler beim Speichern der Bestellung', error });
  }
};
