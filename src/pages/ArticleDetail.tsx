import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await apiClient.get(`/articles/${id}/`);
                setArticle(response.data);
            } catch (error) {
                console.error("Failed to fetch article", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchArticle();
        }
    }, [id]);

    if (loading) return <div className="py-8 text-center text-gray-600">Maqola yuklanmoqda...</div>;
    if (!article) return <div className="py-8 text-center text-gray-600">Maqola topilmadi.</div>;

    const mainTranslation = article.translations.find(t => t.language === 'uz') || article.translations[0];

    return (
        <div className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{mainTranslation?.title}</h1>
                <div className="prose max-w-none">
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                        <p><strong>Mualliflar:</strong> {article.authors.map(a => `${a.last_name} ${a.first_name}`).join(", ")}</p>
                        <p><strong>DOI:</strong> {article.doi}</p>
                        <p><strong>Sahifalar:</strong> {article.pages}</p>
                        <p><strong>Ko'rishlar:</strong> {article.views}</p>
                    </div>

                    <h2 className="text-xl font-semibold">Annotatsiya</h2>
                    <p>{mainTranslation?.abstract}</p>

                    {article.keywords.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold mt-6">Kalit so'zlar</h2>
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map(kw => <span key={kw.name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{kw.name}</span>)}
                            </div>
                        </>
                    )}
                    
                    {article.references && (
                         <>
                            <h2 className="text-xl font-semibold mt-6">Foydalanilgan adabiyotlar</h2>
                            <div className="text-sm whitespace-pre-line">{article.references}</div>
                        </>
                    )}
                </div>
                <button onClick={() => navigate(-1)} className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Orqaga
                </button>
            </div>
        </div>
    );
};

export default ArticleDetail;