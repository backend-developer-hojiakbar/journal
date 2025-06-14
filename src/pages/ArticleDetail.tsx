// src/components/ArticleDetail.tsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const article = location.state?.article; // Maqola ma'lumotlari state orqali uzatiladi

  if (!article) {
    return <div className="py-8 text-center text-gray-600">Мақола топилмади</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{article.authors.join(" | ")}</span>
          <span className="mx-2">|</span>
          <span>{new Date(article.date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })} {new Date(article.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          <span className="mx-2">|</span>
          <span>Кўришлар: {article.views}</span>
          <span className="mx-2">|</span>
          <span>Саҳифалар: {article.pages}</span>
        </div>
        <p className="text-gray-600 mb-6">
          <span className="font-semibold text-blue-600">Аннотация:</span> {article.abstract}
        </p>
        <div className="text-sm text-gray-500">
          <p><span className="font-semibold">DOI:</span> {article.doi}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Орқага қайтиш
        </button>
      </div>
    </div>
  );
};

export default ArticleDetail;