import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { Category } from '../../types/Interfaces';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

type Props = {
    categories: Category[];
    onDelete: (id?: number) => void;
};

const CategoryPreview: React.FC<Props> = ({ categories, onDelete }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Vorschau</h3>
            {categories.map(category => (
                <div
                    key={category._id}
                    className="border p-4 rounded mb-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            {category.imageUrl && (
                                <img
                                    src={`${BACKEND_URL}/${category.imageUrl}`}
                                    alt={category.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            )}
                            <div className="font-bold text-base">{category.name}</div>
                        </div>
                        <button
                            onClick={() => onDelete(category._id)}
                            className="text-red-600 hover:underline text-sm"
                        >
                            Löschen
                        </button>
                    </div>

                    <div className="ml-14 text-sm text-gray-700">
                        <p>{category.description}</p>

                        {category.options && category.options.length > 0 && (
                            <div className="mt-2 text-gray-500">
                                {category.options.map((option, i) => (
                                    <div key={i}>
                                        <span className="font-medium">{option.name}:</span>
                                        {option.values?.map((val, j) => (
                                            <span key={j} className="ml-2">
                                                {val.value}
                                                {val.price && ` (${val.price})`}
                                                {j < (option.values?.length || 0) - 1 ? ',' : ''}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryPreview;
