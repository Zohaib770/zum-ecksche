import React, { useState, useEffect } from 'react';
import { Category, Food, Option } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FoodPreview from './FoodPreview';

const FoodForm: React.FC = () => {
  const [availableFoods, setAvailableFoods] = useState<Food[]>([]);
  const [availableOptionsNames, setAvailableOptionsNames] = useState<Option[]>([]);
  const [availableCategoryNames, setAvailableCategoryNames] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [food, setFood] = useState<Food>({
    name: "",
    description: "",
    price: 0,
    category: "",
    options: []
  });

  const [currentOption, setCurrentOption] = useState({
    name: "",
    value: "",
    price: ""
  });

  const loadData = async () => {
    try {
      const [options, categories] = await Promise.all([
        Apis.fetchOption(),
        Apis.fetchCategories(),
      ]);
      setAvailableOptionsNames(options);
      setAvailableCategoryNames(categories);
    } catch (error) {
      toast.error('Fehler beim Laden der Daten');
      console.error("Error loading data:", error);
    }
  };

  const loadFoods = async () => {
    try {
      const fetchedFoods = await Apis.fetchFood();
      setAvailableFoods(fetchedFoods);
    } catch (error) {
      toast.error('Fehler beim Laden der Food');
    }
  };

  useEffect(() => {
    loadData();
    loadFoods();
  }, []);

  // Option handlers
  const addOption = () => {
    if (!currentOption.name || !currentOption.value) {
      toast.warn('Bitte Optionenname und Wert ausfüllen');
      return;
    }

    setFood(prev => {
      const existingOptionIndex = prev.options?.findIndex(opt => opt.name === currentOption.name) ?? -1;

      const priceValue = currentOption.price
        ? Number(currentOption.price)
        : undefined;

      // Ensure we don't set NaN
      const safePriceValue = (priceValue !== undefined && !isNaN(priceValue))
        ? priceValue
        : undefined;

      if (existingOptionIndex >= 0) {
        // Update existing option
        const updatedOptions = [...(prev.options || [])];
        updatedOptions[existingOptionIndex] = {
          ...updatedOptions[existingOptionIndex],
          values: [
            ...(updatedOptions[existingOptionIndex].values || []),
            {
              value: currentOption.value,
              price: safePriceValue
            }
          ]
        };
        return { ...prev, options: updatedOptions };
      }

      // Add new option
      return {
        ...prev,
        options: [
          ...(prev.options || []),
          {
            name: currentOption.name,
            values: [{
              value: currentOption.value,
              price: safePriceValue
            }]
          }
        ]
      };
    });

    setCurrentOption({ name: '', value: '', price: '' });
    toast.success('Option hinzugefügt');
  };

  const removeOption = (optionName: string, valueIndex: number) => {
    setFood(prev => {
      const updatedOptions = prev.options
        ?.map(option => {
          if (option.name === optionName) {
            const updatedValues = option.values?.filter((_, i) => i !== valueIndex);
            return { ...option, values: updatedValues?.length ? updatedValues : undefined };
          }
          return option;
        })
        .filter(option => option.values?.length) || [];

      return { ...prev, options: updatedOptions.length ? updatedOptions : undefined };
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!food.category || !food.name || !food.price) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const res = await Apis.updateFood(editingId, food);
        toast.success('Speise erfolgreich aktualisiert');
      } else {
        await Apis.addFood(food);
        toast.success('Speise erfolgreich hinzugefügt');
      }

      setFood({
        name: "",
        description: "",
        price: 0,
        category: "",
        options: []
      });
      setEditingId(null);
      await loadFoods();
    } catch (error) {
      toast.error(editingId ? 'Fehler beim Aktualisieren der Speise' : 'Fehler beim Hinzufügen der Speise');
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await Apis.deleteFood(id);
      toast.success('Food erfolgreich gelöscht');
      setAvailableFoods(prev => prev.filter(food => food._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFood({
          name: "",
          description: "",
          price: 0,
          category: "",
          options: []
        });
      }
    } catch (error) {
      toast.error('Fehler beim Löschen der Food');
    }
  };

  const handleEdit = (foodToEdit: Food) => {
    setEditingId(foodToEdit._id || null);
    setFood({
      name: foodToEdit.name || "",
      description: foodToEdit.description || "",
      price: foodToEdit.price || 0,
      category: foodToEdit.category || "",
      options: foodToEdit.options || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingId ? 'Speise bearbeiten' : 'Neue Speise'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input
              type="text"
              value={food.name}
              onChange={(e) => setFood({ ...food, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              value={food.description}
              onChange={(e) => setFood({ ...food, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preis*</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={food.price}
                onChange={(e) => setFood({ ...food, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie*</label>
              <select
                value={food.category}
                onChange={(e) => setFood({ ...food, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value="">Auswählen...</option>
                {availableCategoryNames.map((cat) => (
                  <option key={String(cat._id)} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Options Section */}
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-800 mb-3">Optionen</h3>

            {/* Existing Options */}
            {food.options?.length ? (
              <div className="mb-4 space-y-3">
                {food.options.map((option, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <div className="font-medium text-gray-700 mb-2">{option.name}</div>
                    <ul className="space-y-1">
                      {option.values?.map((val, j) => (
                        <li key={j} className="flex justify-between items-center">
                          <span>{val.value}</span>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-3">
                              {val.price}€
                            </span>
                            <button
                              type="button"
                              onClick={() => removeOption(option.name, j)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Add New Option */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={currentOption.name}
                  onChange={(e) => setCurrentOption({ ...currentOption, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Option auswählen</option>
                  {availableOptionsNames.map((option) => (
                    <option key={String(option._id)} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Wert"
                    value={currentOption.value}
                    onChange={(e) => setCurrentOption({ ...currentOption, value: e.target.value })}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    placeholder="Preis"
                    value={currentOption.price}
                    onChange={(e) => setCurrentOption({ ...currentOption, price: e.target.value })}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-3 py-2 h-[42px] border border-transparent rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting
              ? 'Wird verarbeitet...'
              : editingId
                ? 'Speise aktualisieren'
                : 'Speise hinzufügen'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFood({
                  name: "",
                  description: "",
                  price: 0,
                  category: "",
                  options: []
                });
              }}
              className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Abbrechen
            </button>
          )}
        </form>
      </div>

      <FoodPreview
        foods={availableFoods}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
};

export default FoodForm;