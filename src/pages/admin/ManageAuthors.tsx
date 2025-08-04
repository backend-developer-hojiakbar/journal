import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageAuthors = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ last_name: '', first_name: '', patronymic: '', organization: '', position: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/authors/');
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch authors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { ...item } : { last_name: '', first_name: '', patronymic: '', organization: '', position: '' });
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
                await apiClient.put(`/authors/${editingItem.id}/`, formData);
            } else {
                await apiClient.post('/authors/', formData);
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
                await apiClient.delete(`/authors/${id}/`);
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
                <h1 className="text-3xl font-bold">Mualliflarni Boshqarish</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <Plus size={20} className="mr-2" /> Yangi Muallif
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                     <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">F.I.O</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Tashkilot</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.last_name} {item.first_name} {item.patronymic}</td>
                                <td className="py-3 px-4">{item.organization}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Muallifni Tahrirlash" : "Yangi Muallif Qo'shish"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Familiya</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Ism</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Otasining ismi</label>
                        <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Tashkilot</label>
                        <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Lavozim</label>
                        <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-md mr-2">Bekor qilish</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Saqlash</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageAuthors;