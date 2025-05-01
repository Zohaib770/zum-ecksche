const Extra  = require('../models/ExtraModel');

const getExtra = async (req, res) => {
    try {
        const extra = await Extra.find();
        res.json(extra);
    } catch (error) {
        console.log("fehler: ", error)
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExtra
};