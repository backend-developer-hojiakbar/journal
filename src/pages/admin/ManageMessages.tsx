import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Eye, Trash2 } from 'lucide-react';

const ManageMessages = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/contact/');
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewMessage = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
            try {
                await apiClient.delete(`/contact/${id}/`);
                fetchData();
            } catch (error) {
                alert("Xatolik yuz berdi!");
            }
        }
    };

    if (loading) return <p>Yuklanmoqda...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Bog'lanish Xabarlari</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Yuboruvchi</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Mavzu</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Sana</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {items.map((item: any) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{item.name} ({item.email})</td>
                                <td className="py-3 px-4 font-medium">{item.subject}</td>
                                <td className="py-3 px-4">{new Date(item.created_at).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleViewMessage(item)} className="p-2 text-green-600 hover:text-green-800"><Eye size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedItem?.subject || ""}>
                {selectedItem && (
                     <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Yuboruvchi:</h4>
                            {/* XATO TUZATILGAN QATOR */}
                            <p>{`${selectedItem.name} <${selectedItem.email}>`}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Sana:</h4>
                            <p>{new Date(selectedItem.created_at).toLocaleString()}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Xabar:</h4>
                            <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded-md">{selectedItem.message}</p>
                        </div>
                         <div className="flex justify-end pt-4">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Yopish</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageMessages;