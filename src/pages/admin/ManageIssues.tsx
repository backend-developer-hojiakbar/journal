import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ManageIssues = () => {
    const [items, setItems] = useState([]);
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState<any>({ journal: '', title: '', published_date: '', is_current: false, cover_image: null, pdf_file: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const issuesRes = await apiClient.get('/issues/');
            const journalsRes = await apiClient.get('/journals/');
            setItems(issuesRes.data);
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
        if (item) {
            setFormData({ ...item, cover_image: null, pdf_file: null });
        } else {
            setFormData({ journal: '', title: '', published_date: '', is_current: false, cover_image: null, pdf_file: null });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'cover_image' || key === 'pdf_file') {
                if (formData[key] instanceof File) {
                    data.append(key, formData[key]);
                }
            } else if (formData[key] !== null && formData[key] !== undefined) {
                 data.append(key, formData[key]);
            }
        });
        
        try {
            if (editingItem) {
                await apiClient.patch(`/issues/${editingItem.id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await apiClient.post('/issues/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save issue", error.response?.data);
            alert("Xatolik yuz berdi!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
            try {
                await apiClient.delete(`/issues/${id}/`);
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
                <h1 className="text-3xl font-bold">Nashrlarni Boshqarish</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
                    <Plus size={20} className="mr-2" /> Yangi Nashr
                </button>
            </div>
             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sarlavha</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Jurnal</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sana</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Joriy?</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.title}</td>
                                <td className="py-3 px-4">{item.journal_name}</td>
                                <td className="py-3 px-4">{new Date(item.published_date).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{item.is_current ? 'Ha' : "Yo'q"}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? "Nashrni Tahrirlash" : "Yangi Nashr Qo'shish"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Jurnal</label>
                        <select name="journal" value={formData.journal} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                            <option value="" disabled>Jurnalni tanlang</option>
                            {journals.map((j: any) => <option key={j.id} value={j.id}>{j.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Sarlavha</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Chop etilgan sana</label>
                        <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Muqova rasmi</label>
                        <input type="file" name="cover_image" onChange={handleChange} className="w-full"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">PDF Fayl</label>
                        <input type="file" name="pdf_file" onChange={handleChange} className="w-full"/>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="is_current" checked={formData.is_current} onChange={handleChange} className="h-4 w-4 rounded"/>
                        <label className="ml-2 block text-sm">Joriy nashrmi?</label>
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

export default ManageIssues;