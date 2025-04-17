const Category = require('../models/categoryModel');
const multer = require('multer');
const fs = require('fs');
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
      const parsedOptions = req.body.options ? JSON.parse(req.body.options) : [];

      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.file ? req.file.path : undefined,
        options: parsedOptions,
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
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body; // Falls du nur `id` im Body sendest

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden.' });
    }

    // Bild löschen, falls vorhanden
    if (category.imageUrl) {
      const imagePath = path.join(__dirname, '..', category.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Fehler beim Löschen des Bildes:', err.message);
        } else {
          console.log('Bild erfolgreich gelöscht:', category.imageUrl);
        }
      });
    }

    // Kategorie aus der Datenbank löschen
    await Category.findByIdAndDelete(categoryId);
    console.log("Kategorie aus der Datenbank gelöscht");
    res.status(200).json({ message: 'Kategorie und Bild erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Kategorie.', error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};