import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';

const ArticleDebug = () => {
    const [articleId, setArticleId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testArticleAPI = async () => {
        if (!articleId.trim()) {
            setError('Iltimos maqola ID sini kiriting');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Testing API call to:', `/articles/${articleId}/`);
            const response = await apiClient.get(`/articles/${articleId}/`);
            console.log('API Response:', response);
            setResult(response.data);
        } catch (err: any) {
            console.error('API Error:', err);
            setError(err.response?.data?.detail || err.message || 'Noma\'lum xatolik');
        } finally {
            setLoading(false);
        }
    };

    const testAllArticles = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Testing API call to: /articles/');
            const response = await apiClient.get('/articles/');
            console.log('API Response:', response);
            setResult(response.data);
        } catch (err: any) {
            console.error('API Error:', err);
            setError(err.response?.data?.detail || err.message || 'Noma\'lum xatolik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Article API Debug Tool</h2>
            
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={articleId}
                        onChange={(e) => setArticleId(e.target.value)}
                        placeholder="Maqola ID si (masalan: 1)"
                        className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <button
                        onClick={testArticleAPI}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Yuklanmoqda...' : 'Bitta maqolani test qilish'}
                    </button>
                </div>
                
                <button
                    onClick={testAllArticles}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Yuklanmoqda...' : 'Barcha maqolalarni test qilish'}
                </button>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-800">Xatolik:</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800">Natija:</h3>
                        <pre className="text-sm mt-2 bg-white p-2 rounded border overflow-auto max-h-96">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDebug;