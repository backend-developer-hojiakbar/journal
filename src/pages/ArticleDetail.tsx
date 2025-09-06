import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

interface Translation {
    language: string;
    title: string;
    abstract: string;
}

interface Author {
    id: number;
    first_name: string;
    last_name: string;
    organization?: string;
    position?: string;
}

interface Keyword {
    id: number;
    name: string;
}

interface Article {
    id: number;
    translations: Translation[];
    authors: Author[];
    keywords: Keyword[];
    doi?: string;
    pages?: string;
    views?: number;
    references?: string;
}

const ArticleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) {
                setError('Maqola ID si topilmadi');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching article with ID:', id);
                const response = await apiClient.get(`/articles/${id}/`);
                console.log('Article response:', response.data);
                setArticle(response.data);
                setError(null);
            } catch (error: any) {
                console.error('Failed to fetch article:', error);
                if (error.response?.status === 404) {
                    setError('Maqola topilmadi.');
                } else if (error.response?.status === 500) {
                    setError('Server xatosi. Iltimos, keyinroq urinib ko\'ring.');
                } else {
                    setError('Maqolani yuklashda xatolik yuz berdi.');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="py-8 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Maqola yuklanmoqda...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Xatolik yuz berdi</h2>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Orqaga qaytish
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="py-8 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Maqola topilmadi</h2>
                        <p className="text-gray-600 mb-4">Siz qidirgan maqola mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Orqaga qaytish
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const mainTranslation = article.translations?.find(t => t.language === 'uz') || article.translations?.[0];

    return (
        <div className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {mainTranslation?.title || 'Nomsiz maqola'}
                </h1>
                <div className="prose max-w-none">
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                        <p><strong>Mualliflar:</strong> {article.authors?.length > 0 ? article.authors.map(a => `${a.last_name} ${a.first_name}`).join(", ") : 'Noma\'lum muallif'}</p>
                        <p><strong>DOI:</strong> {article.doi || 'Mavjud emas'}</p>
                        <p><strong>Sahifalar:</strong> {article.pages || 'Mavjud emas'}</p>
                        <p><strong>Ko'rishlar:</strong> {article.views || 0}</p>
                    </div>

                    <h2 className="text-xl font-semibold mb-3">Annotatsiya</h2>
                    <p className="mb-6">{mainTranslation?.abstract || 'Annotatsiya mavjud emas'}</p>

                    {article.keywords && article.keywords.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold mt-6 mb-3">Kalit so'zlar</h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {article.keywords.map(kw => (
                                    <span key={kw.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {kw.name}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                    
                    {article.references && (
                        <>
                            <h2 className="text-xl font-semibold mt-6 mb-3">Foydalanilgan adabiyotlar</h2>
                            <div className="text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg border">
                                {article.references}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-8 flex gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Orqaga
                    </button>
                    {article.doi && (
                        <a 
                            href={`https://doi.org/${article.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            DOI orqali ko'rish
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;