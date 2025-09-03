import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { Search } from 'lucide-react';

const Archive = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await apiClient.get('/issues/');
                setIssues(response.data);
            } catch (error) {
                console.error("Failed to fetch issues", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);
  
    if (loading) return <p className="text-center py-10">Arxiv yuklanmoqda...</p>;

    return (
        <div className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Jurnallar arxivi</h1>
                <div className="mb-8 max-w-lg mx-auto">
                    {/* Qidiruv funksiyasi keyingi bosqichda qo'shilishi mumkin */}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {issues.map((issue: any) => (
                        <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group">
                            {/* RASM CONTAINERIGA ASPECT RATIO QO'SHILDI */}
                            <div className="aspect-[210/297] overflow-hidden">
                                <img src={issue.cover_image} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-600 mb-3">{issue.title}</p>
                                <a href={issue.pdf_file} download className="inline-block w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                                    Yuklab olish
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Archive;