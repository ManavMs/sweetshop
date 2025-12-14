import React from 'react';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    description?: string;
}

interface SweetCardProps {
    sweet: Sweet;
    onPurchase: (id: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase }) => {
    return (
        <div className="overflow-hidden bg-white border rounded shadow hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {sweet.imageUrl ? (
                    <img src={sweet.imageUrl} alt={sweet.name} className="object-cover w-full h-full" />
                ) : (
                    <span className="text-4xl">🍬</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{sweet.category}</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-green-600">${sweet.price.toFixed(2)}</span>
                    <span className={`text-sm font-semibold ${sweet.quantity > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
                    </span>
                </div>
                <button
                    onClick={() => onPurchase(sweet.id)}
                    disabled={sweet.quantity === 0}
                    className={`w-full px-4 py-2 font-bold text-white rounded focus:outline-none 
            ${sweet.quantity > 0
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {sweet.quantity > 0 ? 'Purchase' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

export default SweetCard;
