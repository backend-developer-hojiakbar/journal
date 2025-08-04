import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';

const ManageArticles = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/articles/');
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
            try {
                await apiClient.delete(`/articles/${id}/`);
                setItems(items.filter((item: any) => item.id !== id));
            } catch (error) {
                alert("Xatolik yuz berdi!");
            }
        }
    };

    if (loading) return <p>Yuklanmoqda...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Maqolalarni Boshqarish</h1>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    + Yangi maqola qo'shish
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sarlavha</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Nashr ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sahifalar</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-3 px-4">{item.translations[0]?.title || 'Nomsiz'}</td>
                                <td className="py-3 px-4">{item.issue}</td>
                                <td className="py-3 px-4">{item.pages}</td>
                                <td className="py-3 px-4 space-x-2">
                                    <button className="text-blue-500 hover:underline">Tahrirlash</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">O'chirish</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageArticles;