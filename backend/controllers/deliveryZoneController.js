const DeliveryZone = require('../models/deliveryZoneModel');

const getDeliveryZone = async (req, res) => {
    try {
        console.log("get DeliveryZone ENTER")
        const deliveryZones = await DeliveryZone.find();
        res.json(deliveryZones);
    } catch (error) {
        console.error("Error in getDeliveryZone:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDeliveryZone,
};