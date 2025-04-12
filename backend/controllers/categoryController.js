const Category = require('../models/categoryModel');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const uploadPath = process.env.UPLOAD_DIR || 'uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Eindeutiger Dateiname
  },
});

const upload = multer({ storage });

const createCategory = async (req, res) => {
  console.log(" ===== createCategory ENTER");

  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Fehler beim Hochladen des Bildes.' });
    }

    try {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.file ? req.file.path : undefined,
      });

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
};