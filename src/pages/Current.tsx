import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Eye, FileText, Download, Calendar } from 'lucide-react';

const Current = () => {
    const { journalType } = useParams<{ journalType: string }>();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'views'>('date');

    useEffect(() => {
        const fetchCurrentIssue = async () => {
            setLoading(true);
            try {
                // XATOLIK TUZATILDI: ¤t -> current
                const response = await apiClient.get(`/issues/?journal=${journalType}&current=true`);
                if (response.data && response.data.length > 0) {
                    setIssue(response.data[0]);
                    // Sort articles by creation date (newest first)
                    const sortedArticles = [...response.data[0].articles].sort((a, b) => 
                        new Date(b.id).getTime() - new Date(a.id).getTime()
                    );
                    setArticles(sortedArticles);
                } else {
                    setIssue(null);
                    setArticles([]);
                }
            } catch (error) {
                console.error("Failed to fetch current issue", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentIssue();
    }, [journalType]);

    const handleViewArticle = (articleId: number) => {
        console.log('Navigating to article with ID:', articleId);
        navigate(`/article/${articleId}`);
    };

    // Sort articles when sortBy changes
    useEffect(() => {
        if (issue && issue.articles) {
            const sortedArticles = [...issue.articles].sort((a, b) => {
                if (sortBy === 'date') {
                    // Sort by article ID (assuming higher ID means newer)
                    return b.id - a.id;
                } else {
                    // Sort by views (descending)
                    return (b.views || 0) - (a.views || 0);
                }
            });
            setArticles(sortedArticles);
        }
    }, [sortBy, issue]);

    if (loading) return <p className="text-center py-10">Joriy nashr yuklanmoqda...</p>;
    if (!issue) return <p className="text-center py-10">Bu jurnal uchun joriy nashr topilmadi.</p>;

    return (
        <div className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{issue.journal_name} - {issue.title}</h1>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <a href={issue.pdf_file} download className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        <Download className="h-5 w-5 mr-2" />
                        To'liq nashrni yuklash (PDF)
                    </a>
                    
                    {/* Sort options */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700">Saralash:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'views')}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="date">Yaratilgan sana</option>
                            <option value="views">Ko'rishlar soni</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-6">
                    {articles && articles.length > 0 ? articles.map((article: any) => (
                        <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold text-blue-800 mb-2 hover:text-blue-600 cursor-pointer" onClick={() => handleViewArticle(article.id)}>
                                {article.translations?.[0]?.title || "Nomsiz maqola"}
                            </h2>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-4 gap-y-1">
                                <span>{article.authors ? article.authors.map(a => `${a.last_name} ${a.first_name.charAt(0)}.`).join(", ") : "Noma'lum muallif"}</span>
                                <span className="flex items-center"><FileText className="h-4 w-4 mr-1" /> {article.pages || "N/A"}</span>
                                <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> {article.views || 0}</span>
                                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(article.id).toLocaleDateString('uz-UZ')}</span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold text-gray-800">Annotatsiya:</span> {article.translations?.[0]?.abstract || "Annotatsiya mavjud emas"}
                            </p>
                            <button onClick={() => handleViewArticle(article.id)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Ko'rish
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Bu nashrda maqolalar mavjud emas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Current;