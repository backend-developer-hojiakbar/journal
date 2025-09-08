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
    article_file?: string;
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
    const getTranslationByLanguage = (lang: string) => article.translations?.find(t => t.language === lang);
    const uzTranslation = getTranslationByLanguage('uz');
    const ruTranslation = getTranslationByLanguage('ru');
    const enTranslation = getTranslationByLanguage('en');

    return (
        <div className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {mainTranslation?.title || 'Nomsiz maqola'}
                </h1>
                
                {/* Article Metadata */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2"><strong>Mualliflar:</strong></p>
                            {article.authors && article.authors.length > 0 ? (
                                <ul className="ml-4 space-y-1">
                                    {article.authors.map((author, index) => (
                                        <li key={author.id || index} className="text-gray-700">
                                            <span className="font-medium">{author.last_name} {author.first_name}</span>
                                            {author.organization && (
                                                <span className="text-sm text-gray-600 ml-2">({author.organization})</span>
                                            )}
                                            {author.position && (
                                                <span className="text-sm text-gray-500 block ml-2">{author.position}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 ml-4">Noma'lum muallif</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p><strong>DOI:</strong> <span className="text-gray-700">{article.doi || 'Mavjud emas'}</span></p>
                            <p><strong>Sahifalar:</strong> <span className="text-gray-700">{article.pages || 'Mavjud emas'}</span></p>
                            <p><strong>Ko'rishlar:</strong> <span className="text-gray-700">{article.views || 0}</span></p>
                            {article.article_file && (
                                <p><strong>Maqola fayli:</strong> 
                                    <a 
                                        href={article.article_file} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="ml-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        PDF yuklab olish
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Annotations in 3 languages */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Annotatsiya</h2>
                    <div className="space-y-6">
                        {/* Uzbek Annotation */}
                        {uzTranslation && (
                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                                <h3 className="font-semibold text-blue-800 mb-2">O'zbek tilida</h3>
                                <p className="text-gray-700 leading-relaxed">{uzTranslation.abstract}</p>
                            </div>
                        )}
                        
                        {/* Russian Annotation */}
                        {ruTranslation && (
                            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                                <h3 className="font-semibold text-green-800 mb-2">Rus tilida</h3>
                                <p className="text-gray-700 leading-relaxed">{ruTranslation.abstract}</p>
                            </div>
                        )}
                        
                        {/* English Annotation */}
                        {enTranslation && (
                            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                                <h3 className="font-semibold text-purple-800 mb-2">Ingliz tilida</h3>
                                <p className="text-gray-700 leading-relaxed">{enTranslation.abstract}</p>
                            </div>
                        )}
                        
                        {/* If no translations found */}
                        {(!uzTranslation && !ruTranslation && !enTranslation) && (
                            <p className="text-gray-500 italic">Annotatsiya mavjud emas</p>
                        )}
                    </div>
                </div>

                {/* Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Kalit so'zlar</h2>
                        <div className="flex flex-wrap gap-2">
                            {article.keywords.map(kw => (
                                <span key={kw.id} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-colors">
                                    {kw.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* References */}
                {article.references && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Foydalanilgan adabiyotlar</h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                {article.references}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Orqaga
                    </button>
                    
                    {article.article_file && (
                        <a 
                            href={article.article_file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            PDF yuklab olish
                        </a>
                    )}
                    
                    {article.doi && (
                        <a 
                            href={`https://doi.org/${article.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            DOI orqali ko'rish
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;