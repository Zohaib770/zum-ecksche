const Food = require('../models/foodModel');
const Category = require('../models/categoryModel');

exports.createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getFoodByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden.' });
    }

    const food = await Food.find({ category: category.name }).sort({ order: 1 });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ category: 1 });;
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    console.log("update Food ENTER");
    const id = req.params.id;
    const food = req.body;          
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      food,
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Speise nicht gefunden.' });
    }

    console.log("Food erfolgreich aktualisiert");
    res.status(200).json({ message: 'Speise erfolgreich aktualisiert.', food: updatedFood });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Speise:", error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren der Speise.', error: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    console.log("delete Food ENTER");
    const { foodId } = req.body;
    await Food.findByIdAndDelete(foodId);
    console.log("Food aus der Datenbank gelöscht");
    res.status(200).json({ message: 'Kategorie und Bild erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Kategorie.', error: error.message });
  }
};