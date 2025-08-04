import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageBoard = () => {
    const [items, setItems] = useState([]);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ journal: '', full_name: '', position_description: '', role: 'hayat_azosi', order: 0 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const boardRes = await apiClient.get('/board-members/');
            const journalsRes = await apiClient.get('/journals/');
            setItems(boardRes.data);
            setJournals(journalsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { ...item } : { journal: '', full_name: '', position_description: '', role: 'hayat_azosi', order: 0 });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await apiClient.put(`/board-members/${editingItem.id}/`, formData);
            } else {
                await apiClient.post('/board-members/', formData);
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
                await apiClient.delete(`/board-members/${id}/`);
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
                <h1 className="text-3xl font-bold">Tahririyatni Boshqarish</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <Plus size={20} className="mr-2" /> Yangi A'zo
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                     <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">F.I.O</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Jurnal ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Rol</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.full_name}</td>
                                <td className="py-3 px-4">{item.journal}</td>
                                <td className="py-3 px-4">{item.role}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "A'zoni Tahrirlash" : "Yangi A'zo Qo'shish"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">Jurnal</label>
                        <select name="journal" value={formData.journal} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                            <option value="" disabled>Jurnalni tanlang</option>
                            {journals.map((j: any) => <option key={j.id} value={j.id}>{j.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">F.I.O</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Lavozim va Tavsifi</label>
                        <textarea name="position_description" value={formData.position_description} onChange={handleChange} rows={3} required className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Rol</label>
                        <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                            <option value="bosh_muharrir">Bosh muharrir</option>
                            <option value="masul_kotib">Mas'ul kotib</option>
                            <option value="hayat_azosi">Hay'at a'zosi</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Tartib Raqami</label>
                        <input type="number" name="order" value={formData.order} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-md">Bekor qilish</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Saqlash</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageBoard;