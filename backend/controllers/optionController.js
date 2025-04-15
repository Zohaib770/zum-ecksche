const { Options } = require('../models/optionModel');

const getOption = async (req, res) => {
    try {
        const options = await Options.find();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOption,
};