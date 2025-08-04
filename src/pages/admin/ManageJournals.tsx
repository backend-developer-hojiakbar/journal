import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageJournals = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', short_name: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/journals/');
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch journals", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { name: item.name, short_name: item.short_name } : { name: '', short_name: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiClient.put(`/journals/${editingItem.id}/`, formData);
            } else {
                await apiClient.post('/journals/', formData);
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
                await apiClient.delete(`/journals/${id}/`);
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
                <h1 className="text-3xl font-bold">Jurnallarni Boshqarish</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <Plus size={20} className="mr-2" /> Yangi Jurnal
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">To'liq Nomi</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Qisqa Nomi</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.name}</td>
                                <td className="py-3 px-4">{item.short_name}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Jurnalni Tahrirlash" : "Yangi Jurnal Qo'shish"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">To'liq Nomi</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="short_name" className="block text-sm font-medium text-gray-700 mb-1">Qisqa Nomi (masalan, QX)</label>
                        <input type="text" name="short_name" id="short_name" value={formData.short_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
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

export default ManageJournals;