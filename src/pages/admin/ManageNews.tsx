import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageNews = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/news/');
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { title: item.title, content: item.content } : { title: '', content: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiClient.put(`/news/${editingItem.id}/`, formData);
            } else {
                await apiClient.post('/news/', formData);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert("Xatolik yuz berdi!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
            try {
                await apiClient.delete(`/news/${id}/`);
                fetchData();
            } catch (error) {
                alert("Xatolik yuz berdi!");
            }
        }
    };

    if (loading) return <p>Yuklanmoqda...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Yangiliklarni Boshqarish</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus size={20} className="mr-2" /> Yangi Xabar
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sarlavha</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sana</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.title}</td>
                                <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Yangilikni Tahrirlash" : "Yangi Xabar Qo'shish"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Matn</label>
                        <textarea name="content" id="content" value={formData.content} onChange={handleChange} rows={10} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Bekor qilish</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Saqlash</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageNews;