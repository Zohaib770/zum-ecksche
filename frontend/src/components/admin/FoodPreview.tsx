import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { Food } from '../../types/Interfaces';
import { convertPriceFromDotToComma } from '../../utils/helpFunctions';

type Props = {
    foods: Food[];
    onDelete: (id?: number) => void;
    onEdit: (food: Food) => void;
};

const FoodPreview: React.FC<Props> = ({ foods, onDelete, onEdit }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Vorschau</h3>
            {foods.map(food => (
                <div
                    key={food._id}
                    className="border p-4 rounded mb-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="font-bold text-base">{food.name}</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(food)}
                                className="text-yellow-600 hover:underline text-sm"
                            >
                                Bearbeiten
                            </button>
                            <button
                                onClick={() => onDelete(food._id)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>

                    <div className="ml-14 text-sm text-gray-700">
                        <p>{food.description}</p>

                        {food.options && food.options.length > 0 && (
                            <div className="mt-2 text-gray-500">
                                {food.options.map((option, i) => (
                                    <div key={i}>
                                        <span className="font-medium">{option.name}:</span>
                                        {option.values?.map((val, j) => (
                                            <span key={j} className="ml-2">
                                                {val.value}
                                                {val.price && ` (${convertPriceFromDotToComma(val.price)}€)`}
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

export default FoodPreview;