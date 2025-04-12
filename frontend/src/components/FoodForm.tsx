import React, { useState } from 'react';
import { Food, Category, Option } from '../types';

interface FoodFormProps {
  categories: Category[];
  optionnames: Option[];
  onAdd: (foodData: Omit<Food, '_id'>) => void;
}

const FoodForm: React.FC<FoodFormProps> = ({ categories, optionnames, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [options, setOptions] = useState<{ name: string; values: { value: string; priceAdjustment: number }[] }[]>([]);
  const [newOption, setNewOption] = useState({
    name: '',
    value: '',
    priceAdjustment: 0,
  });

  const handleAddOption = () => {
    if (!newOption.name || !newOption.value) return;

    setOptions(prev => {
      const existing = prev.find(opt => opt.name === newOption.name);
      if (existing) {
        return prev.map(opt =>
          opt.name === newOption.name
            ? {
              ...opt, values: [...opt.values, {
                value: newOption.value,
                priceAdjustment: newOption.priceAdjustment
              }]
            }
            : opt
        );
      }
      return [...prev, {
        name: newOption.name,
        values: [{
          value: newOption.value,
          priceAdjustment: newOption.priceAdjustment
        }]
      }];
    });

    setNewOption({ name: '', value: '', priceAdjustment: 0 });
  };

  const handleRemoveOption = (optionName: string, valueIndex: number) => {
    setOptions(prev =>
      prev.map(opt =>
        opt.name === optionName
          ? {
            ...opt,
            values: opt.values.filter((_, i) => i !== valueIndex)
          }
          : opt
      ).filter(opt => opt.values.length > 0)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.name || !formData.price) return;

    onAdd({
      ...formData,
      price: formData.price,
      options
    });

    setFormData({ name: '', description: '', price: '', category: '' });
    setOptions([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Neue Speise</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preis*</label>
            <input
              type="text"
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie*</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            >
              <option value="">Auswählen...</option>
              {categories.map((cat) => (
                <option key={String(cat._id)} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">Optionen</h3>

          {options.length > 0 && (
            <div className="mb-4 space-y-3">
              {options.map((option, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="font-medium text-gray-700 mb-2">{option.name}</div>
                  <ul className="space-y-1">
                    {option.values.map((val, j) => (
                      <li key={j} className="flex justify-between items-center">
                        <span>{val.value}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-3">
                            {val.priceAdjustment}€
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.name, j)}
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

          <div className="space-y-2 border border-red-500">
            <div className="flex items-center gap-2">
              <select
                value={newOption.name}
                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Option</option>
                {optionnames.map((op) => (
                  <option key={String(op._id)} value={op.name}>
                    {op.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Wert"
                value={newOption.value}
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />

              <input
                type="number"
                placeholder="0"
                step="0.5"
                value={newOption.priceAdjustment}
                onChange={(e) => setNewOption({ ...newOption, priceAdjustment: Number(e.target.value) })}
                className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />

              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                +
              </button>
            </div>
          </div>

        </div>

        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-4"
        >
          Speise hinzufügen
        </button>
      </form>
    </div>
  );
};

export default FoodForm;