import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface IssueItem {
    id: number;
    journal: number;
    journal_name: string;
    journal_short_name?: string;
    journal_type?: 'QX' | 'AI';
    journal_type_display?: string;
    title: string;
    published_date: string;
    is_current: boolean;
    cover_image?: string;
    pdf_file?: string;
}

interface JournalItem {
    id: number;
    name: string;
    short_name: string;
}

interface IssueFormData {
    journal: string | number;
    journal_type: 'QX' | 'AI';
    title: string;
    published_date: string;
    is_current: boolean;
    current_journal_type: 'QX' | 'AI';
    cover_image: File | null;
    pdf_file: File | null;
}

const ManageIssues = () => {
    const [items, setItems] = useState<IssueItem[]>([]);
    const [journals, setJournals] = useState<JournalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IssueItem | null>(null);
    const [formData, setFormData] = useState<IssueFormData>({ 
        journal: '', 
        journal_type: 'QX', 
        title: '', 
        published_date: '', 
        is_current: false, 
        current_journal_type: 'QX', 
        cover_image: null, 
        pdf_file: null 
    });

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

    const handleOpenModal = (item: IssueItem | null = null) => {
        setEditingItem(item);
        if (item) {
            // Determine journal type from multiple sources
            const journalType = item.journal_type || item.journal_short_name || 'QX';
            setFormData({ 
                journal: item.journal, 
                journal_type: journalType as 'QX' | 'AI',
                title: item.title, 
                published_date: item.published_date, 
                is_current: item.is_current,
                current_journal_type: journalType as 'QX' | 'AI',
                cover_image: null, 
                pdf_file: null 
            });
        } else {
            setFormData({ 
                journal: '', 
                journal_type: 'QX',
                title: '', 
                published_date: '', 
                is_current: false, 
                current_journal_type: 'QX', 
                cover_image: null, 
                pdf_file: null 
            });
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
            const files = (e.target as HTMLInputElement).files;
            setFormData({ ...formData, [name]: files?.[0] || null });
        } else if (type === 'radio') {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        
        // Determine journal_type and journal based on selection
        let journalId = formData.journal;
        let journalType = formData.current_journal_type;
        
        if (formData.is_current) {
            // When setting as current, use the selected journal type
            journalType = formData.current_journal_type;
            // Find the journal that matches this type
            const selectedJournal = journals.find(j => j.short_name === journalType);
            if (selectedJournal) {
                journalId = selectedJournal.id;
            }
        } else {
            // For non-current issues, use the selected journal
            const selectedJournal = journals.find(j => j.id == formData.journal);
            if (selectedJournal) {
                journalId = selectedJournal.id;
                journalType = selectedJournal.short_name as 'QX' | 'AI';
            }
        }
        
        // Add all form fields
        data.append('journal', String(journalId));
        data.append('journal_type', journalType);
        data.append('title', formData.title);
        data.append('published_date', formData.published_date);
        data.append('is_current', String(formData.is_current));
        
        // Add file fields if present
        if (formData.cover_image instanceof File) {
            data.append('cover_image', formData.cover_image);
        }
        if (formData.pdf_file instanceof File) {
            data.append('pdf_file', formData.pdf_file);
        }
        
        try {
            if (editingItem) {
                await apiClient.patch(`/issues/${editingItem.id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await apiClient.post('/issues/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchData();
            handleCloseModal();
        } catch (error: any) {
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
                            <th className="text-left py-3 px-4 font-semibold text-sm">Jurnal Turi</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sana</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: IssueItem) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.title}</td>
                                <td className="py-3 px-4">
                                    {(() => {
                                        const journalType = item.journal_type || item.journal_short_name || 'QX';
                                        return (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                journalType === 'QX' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {journalType} - {item.journal_name}
                                            </span>
                                        );
                                    })()} 
                                </td>
                                <td className="py-3 px-4">{new Date(item.published_date).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    {item.is_current ? (
                                        <span className="text-green-600 font-medium">
                                            Joriy nashr ({item.journal_type || item.journal_short_name || 'QX'})
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">Joriy emas</span>
                                    )}
                                </td>
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
                    {!formData.is_current && (
                        <div>
                            <label className="block text-sm font-medium">Jurnal</label>
                            <select 
                                name="journal" 
                                value={formData.journal} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="" disabled>Jurnalni tanlang</option>
                                {journals.map((j: JournalItem) => (
                                    <option key={j.id} value={j.id}>
                                        {j.short_name} - {j.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {formData.is_current && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanlangan jurnal</label>
                            <div className="mt-1 p-3 bg-gray-100 rounded-md border">
                                <span className="font-medium">
                                    {formData.current_journal_type === 'QX' ? "O'zbekiston qishloq va suv xo'jaligi" : "Agro ilm"} 
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                        formData.current_journal_type === 'QX' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        ({formData.current_journal_type})
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
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
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                name="is_current" 
                                checked={formData.is_current} 
                                onChange={handleChange} 
                                className="h-4 w-4 rounded"
                            />
                            <label className="ml-2 block text-sm">Joriy nashrmi?</label>
                        </div>
                        
                        {formData.is_current && (
                            <div className="ml-6 space-y-3">
                                <p className="text-sm font-medium text-gray-700">Joriy nashr turi:</p>
                                <div className="flex space-x-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="current_journal_type"
                                            value="QX"
                                            checked={formData.current_journal_type === 'QX'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 flex items-center">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md border-2 border-blue-300 text-sm font-medium">
                                                QX
                                            </span>
                                            <span className="ml-2 text-sm text-gray-600">Qishloq xo'jaligi</span>
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="current_journal_type"
                                            value="AI"
                                            checked={formData.current_journal_type === 'AI'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-3 flex items-center">
                                            <span className="bg-green-100 text-green-800 px-3 py-2 rounded-md border-2 border-green-300 text-sm font-medium">
                                                AI
                                            </span>
                                            <span className="ml-2 text-sm text-gray-600">Agro Ilm</span>
                                        </span>
                                    </label>
                                </div>
                                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <div className="text-sm font-medium text-blue-800">
                                        ✅ Joriy nashr ({formData.current_journal_type})
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        Bu nashr {formData.current_journal_type === 'QX' ? 'Qishloq xo\'jaligi' : 'Agro Ilm'} jurnali uchun joriy nashr bo'ladi
                                    </div>
                                </div>
                            </div>
                        )}
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