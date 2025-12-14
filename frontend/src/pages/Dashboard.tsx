import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import SweetCard from '../components/SweetCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { logout, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchSweets = async (query = '', min = minPrice, max = maxPrice) => {
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (min) params.append('minPrice', min);
            if (max) params.append('maxPrice', max);

            const res = await api.get(`/sweets/search?${params.toString()}`);
            setSweets(res.data);
        } catch (err) {
            console.error('Failed to fetch sweets', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSweets(search, minPrice, maxPrice);
    };

    const handlePurchase = async (id: number) => {
        try {
            const res = await api.post(`/sweets/${id}/purchase`);
            setSweets(sweets.map(s => s.id === id ? { ...s, quantity: res.data.quantity } : s));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Purchase failed');
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center relative" style={{ backgroundImage: "url('/app-bg.jpg')" }}>
            <nav className="z-20 bg-white/80 backdrop-blur-md shadow sticky top-0">
                <div className="container px-6 py-4 mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-600">🍭 Sweet Shop</h1>
                    <div className="flex items-center space-x-4">
                        {isAdmin && (
                            <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-semibold transition">Admin Panel</Link>
                        )}
                        <button onClick={logout} className="text-red-500 hover:text-red-700 font-semibold transition">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 container px-6 py-8 mx-auto">
                <RevealOnScroll>
                    <div className="relative h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
                        <img src="/menu-banner.png" alt="Sweet Shop Menu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 animate-gradient-overlay flex items-center justify-center">
                            <h2 className="text-4xl font-bold text-gray-900 drop-shadow-sm">Explore Our Delightful Menu</h2>
                        </div>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                    <div className="mb-8 flex justify-center">
                        <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                {isAdmin ? 'Find the Sweets' : 'Find Your Craving'}
                            </h3>
                            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                                <div className="flex w-full">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearch(val);
                                            if (val === '') fetchSweets('', minPrice, maxPrice);
                                        }}
                                        placeholder="Search by name..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition duration-200"
                                    />
                                    <button type="submit" className="px-8 py-3 bg-purple-600 text-white font-bold rounded-r-lg hover:bg-purple-700 shadow-md transition duration-200 transform hover:scale-105">
                                        Search
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        placeholder="Min Price"
                                        className="w-1/2 p-2 border rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        placeholder="Max Price"
                                        className="w-1/2 p-2 border rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </RevealOnScroll>

                {loading ? (
                    <div className="text-center">Loading sweets...</div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {sweets.map((sweet, index) => (
                            <RevealOnScroll key={sweet.id} delay={index * 50}>
                                <SweetCard sweet={sweet} onPurchase={handlePurchase} />
                            </RevealOnScroll>
                        ))}
                    </div>
                )}

                {sweets.length === 0 && !loading && (
                    <div className="text-center text-gray-500 mt-10">No sweets found 😔</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
