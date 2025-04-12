const Option = require('../models/optionModel');

const getOption = async (req, res) => {
    try {
        const options = await Option.find().sort({ order: 1 });
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOption,
};