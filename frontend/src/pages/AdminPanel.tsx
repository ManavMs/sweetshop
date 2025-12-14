import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

const AdminPanel: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const { logout } = useAuth();

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchSweets = async () => {
        try {
            const res = await api.get('/sweets');
            setSweets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        };

        try {
            if (editingId) {
                await api.put(`/sweets/${editingId}`, data);
            } else {
                await api.post('/sweets', data);
            }
            resetForm();
            fetchSweets();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/sweets/${id}`);
            fetchSweets();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleEdit = (sweet: Sweet) => {
        setEditingId(sweet.id);
        setName(sweet.name);
        setCategory(sweet.category);
        setPrice(sweet.price.toString());
        setQuantity(sweet.quantity.toString());
    };

    const handleRestock = async (id: number) => {
        const amount = prompt('Enter quantity to add:', '10');
        if (!amount) return;
        try {
            await api.post(`/sweets/${id}/restock`, { quantity: parseInt(amount) });
            fetchSweets();
        } catch (err) {
            alert('Restock failed');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setCategory('');
        setPrice('');
        setQuantity('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                    <div className="space-x-4">
                        <Link to="/" className="text-blue-600 hover:underline">Back to Shop</Link>
                        <button onClick={logout} className="text-red-500 font-bold">Logout</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="bg-white p-6 rounded shadow-md h-fit">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Name</label>
                                <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Category</label>
                                <input className="w-full border p-2 rounded" value={category} onChange={e => setCategory(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Price</label>
                                <input type="number" step="0.01" className="w-full border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Quantity</label>
                                <input type="number" className="w-full border p-2 rounded" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">
                                {editingId ? 'Update Sweet' : 'Add Sweet'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="w-full mt-2 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">Cancel</button>
                            )}
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="md:col-span-2 bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Inventory ({sweets.length})</h2>
                        <div className="overflow-auto max-h-[600px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 border-b">Image</th>
                                        <th className="p-3 border-b">Name</th>
                                        <th className="p-3 border-b">Category</th>
                                        <th className="p-3 border-b">Price</th>
                                        <th className="p-3 border-b">Qty</th>
                                        <th className="p-3 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sweets.map(sweet => (
                                        <tr key={sweet.id} className="hover:bg-gray-50">
                                            <td className="p-3 border-b">
                                                <img src={sweet.imageUrl || '/placeholder.png'} alt={sweet.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                                            </td>
                                            <td className="p-3 border-b">{sweet.name}</td>
                                            <td className="p-3 border-b">{sweet.category}</td>
                                            <td className="p-3 border-b">${sweet.price.toFixed(2)}</td>
                                            <td className="p-3 border-b">
                                                <span className={`font-bold ${sweet.quantity < 5 ? 'text-red-500' : 'text-green-600'}`}>{sweet.quantity}</span>
                                            </td>
                                            <td className="p-3 border-b space-x-2 flex">
                                                <button onClick={() => handleEdit(sweet)} className="text-blue-500 hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(sweet.id)} className="text-red-500 hover:underline">Delete</button>
                                                <button onClick={() => handleRestock(sweet.id)} className="text-green-600 hover:underline">Restock</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
