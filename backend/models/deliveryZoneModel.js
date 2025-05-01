const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
    name: { type: String },
    distance: { type: String },
    min_order_price: { type: Number},
    delivery_fee: { type: Number},
});

const DeliveryZone = mongoose.model('DeliveryZone', deliveryZoneSchema);
module.exports = DeliveryZone;

