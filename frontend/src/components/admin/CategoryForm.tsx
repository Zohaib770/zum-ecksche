import React, { useState, useEffect, useRef } from 'react';
import { Category, Option } from '../../types/Interfaces';
import Apis from '../../api/Apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryPreview from './CategoryPreview';

const CategoryForm: React.FC = () => {
  const [availableOptionsNames, setAvailableOptionsNames] = useState<Option[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    options: []
  });
  const [currentOption, setCurrentOption] = useState<{ name: string; value: string; price: string }>({
    name: "",
    value: "",
    price: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addOption = () => {
    const { name, value, price } = currentOption;

    if (!name || !value) {
      toast.warn('Bitte Optionenname und Wert ausfüllen');
      return;
    }

    setCategory(prev => {
      const options = prev.options ?? [];

      const existingOptionIndex = options.findIndex(opt => opt.name === name);

      if (existingOptionIndex > -1) {
        const updatedOptions = [...options];
        const existingOption = updatedOptions[existingOptionIndex];

        // Überprüfe, ob der Wert bereits existiert
        const valueExists = existingOption.values?.some(val => val.value === value);

        if (!valueExists) {
          existingOption.values = [
            ...(existingOption.values ?? []),
            { value, price }
          ];
          toast.success('Option hinzugefügt');
        }

        return { ...prev, options: updatedOptions };
      } else {
        toast.success('Option hinzugefügt');
        return {
          ...prev,
          options: [...options, { name, values: [{ value, price }] }]
        };
      }
    });

    setCurrentOption({ name: "", value: "", price: "" });
  };

  const removeOption = (optionIndex: number, valueIndex: number) => {
    setCategory(prev => {
      const updatedOptions = prev.options ? [...prev.options] : [];

      const option = updatedOptions[optionIndex];
      if (!option) return prev;

      // Remove the value at valueIndex
      const updatedValues = option.values?.filter((_, i) => i !== valueIndex) ?? [];

      if (updatedValues.length > 0) {
        // Update the option with remaining values
        updatedOptions[optionIndex] = { ...option, values: updatedValues };
      } else {
        // Remove the whole option if no values remain
        updatedOptions.splice(optionIndex, 1);
      }
      toast.success('Option entfernt');
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!category.name) {
      toast.error('Bitte einen Namen für die Kategorie eingeben');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", category.name);
      formData.append("description", category.description || "");

      if (image) {
        formData.append("image", image);
      }

      // Optional: Optionen als JSON-String anhängen, wenn dein Backend das unterstützt
      if (category.options) {
        formData.append("options", JSON.stringify(category.options));
      }

      console.log("Submitting category:", category);
      console.log("Submitting formData:", formData);

      await Apis.addCategory(formData);
      toast.success('Kategorie erfolgreich erstellt');
      await loadCategories();

      // Optional: Zurücksetzen nach erfolgreicher Erstellung
      setCategory({ name: "", description: "", options: [] });
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error('Fehler beim Erstellen der Kategorie');
      console.error("Fehler beim Absenden des Formulars:", error);
      alert("Fehler beim Erstellen der Kategorie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await Apis.deleteCategory(id);
      toast.success('Kategorie erfolgreich gelöscht');
      setAvailableCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (error) {
      toast.error('Fehler beim Löschen der Kategorie');
    }
  };

  const loadOptions = async () => {
    try {
      const fetchedOptionsNames = await Apis.fetchOption();
      setAvailableOptionsNames(fetchedOptionsNames);
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error('Fehler beim Laden der Optionen');
    }
  };

  const loadCategories = async () => {
    try {
      const fetchedCategories = await Apis.fetchCategories();
      setAvailableCategories(fetchedCategories);
    } catch (error) {
      toast.error('Fehler beim Laden der Kategorien');
    }
  };

  useEffect(() => {
    loadOptions();
    loadCategories();
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Neue Kategorie</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Display Added Options */}
          {category.options && category.options.length > 0 && (
            <div className="mb-4 space-y-3">
              {category.options.map((option, optionIndex) => (
                <div key={optionIndex} className="border rounded-md p-3">
                  <div className="font-medium text-gray-700 mb-2">{option.name}</div>
                  <ul className="space-y-1">
                    {option.values?.map((value, valueIndex) => (
                      <li key={valueIndex} className="flex justify-between items-center">
                        <span>{value.value}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-3">
                            {value.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeOption(optionIndex, valueIndex)}
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
          )}

          {/* Add New Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={currentOption.name}
                onChange={(e) => setCurrentOption({ ...currentOption, name: e.target.value })}

                className="px-2 py-1 border rounded"
              >
                <option value="">Option auswählen</option>
                {availableOptionsNames.map((option) => (
                  <option key={String(option._id)} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Wert"
                value={currentOption.value}
                onChange={(e) => setCurrentOption({ ...currentOption, value: e.target.value })}

                className="px-2 py-1 border rounded"
              />

              <input
                type="number"
                step="0.5"
                placeholder="Preis"
                value={currentOption.price}
                onChange={(e) => setCurrentOption({ ...currentOption, price: e.target.value })}

                className="px-2 py-1 border rounded w-24"
              />

              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bild</label>
            <div className="flex items-center">
              <input
                type="file"
                onChange={handleImageChange}
                ref={fileInputRef}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? 'Wird erstellt...' : 'Kategorie erstellen'}
          </button>
        </form>
      </div>

      <CategoryPreview
        categories={availableCategories}
        onDelete={handleDelete}
      />

    </>
  );
};

export default CategoryForm;