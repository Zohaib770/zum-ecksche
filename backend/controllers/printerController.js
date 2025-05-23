require('dotenv').config();
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const printOrderReceipt = async (req, res) => {
    const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: process.env.PRINTER_IP,
        characterSet: process.env.CHARACTERSET,
    });

    const order = req.body;

    // Beleg erstellen
    printer.alignCenter();
    printer.println(`BESTELLUNG #${order._id}`);
    printer.drawLine();

    order.cartItem.forEach((item) => {
        printer.println(`${item.quantity}x ${item.name} - ${item.price}€`);
    });

    printer.drawLine();
    printer.bold(true);
    printer.println(`GESAMT: ${order.price}€`);
    printer.cut();

    try {
        await printer.execute();
        console.log(printer.getBuffer().toString());
        res.send({ success: true });
    } catch (error) {
        console.error("print fail:", error);
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    printOrderReceipt
};  