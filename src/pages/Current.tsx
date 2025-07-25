import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, FileText, Download } from 'lucide-react';

const qxData = {
  title: "“O‘zbekiston qishloq va suv xo‘jaligi” jurnali 7-son, 2025",
  pdfUrl: "/path/to/qishloq_xojaligi_7_2025.pdf",
  articles: [
    {
      id: 101,
      title: "ZAMONAVIY G'ALLACHILIKDA INNOVATSION TEXNOLOGIYALAR",
      authors: ["A. Valiev", "B. Sodiqov"],
      date: "2025-07-15",
      views: 123,
      pages: "5-10",
      abstract: "Maqolada g'alla hosildorligini oshirishda qo'llanilayotgan yangi agrotexnologiyalar tahlil qilingan...",
    },
  ]
};

const aiData = {
  title: "“AGRO ILM” jurnali 3-son [111], 2025",
  pdfUrl: "/path/to/agro_ilm_3_2025.pdf",
  articles: [
    {
      id: 201,
      title: "MEVA-SABZAVOTLARNI QURITISHNING SAMARALI USULLARI",
      authors: ["F. Qosimova"],
      date: "2025-06-20",
      views: 234,
      pages: "12-18",
      abstract: "Ushbu maqolada meva-sabzavotlarni saqlash muddatini uzaytirish uchun zamonaviy quritish texnologiyalari ko'rib chiqilgan...",
    },
  ]
};

const Current = () => {
  const { journalType } = useParams<{ journalType: string }>();
  const navigate = useNavigate();

  const data = journalType === 'ai' ? aiData : qxData;

  const handleViewArticle = (article: any) => {
    navigate(`/article/${article.id}`, { state: { article } });
  };
  
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{data.title}</h1>
        
        <div className="flex justify-center mb-8">
            <a href={data.pdfUrl} download className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              To'liq nashrni yuklash (PDF)
            </a>
        </div>

        <div className="space-y-6">
          {data.articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-800 mb-2 hover:text-blue-600 cursor-pointer" onClick={() => handleViewArticle(article)}>
                {article.title}
              </h2>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-4 gap-y-1">
                <span>{article.authors.join(" | ")}</span>
                <span className="flex items-center"><FileText className="h-4 w-4 mr-1" /> {article.pages}</span>
                <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> {article.views}</span>
                <span>{new Date(article.date).toLocaleDateString('uz-UZ')}</span>
              </div>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-800">Аннотация:</span> {article.abstract}
              </p>
              <button
                onClick={() => handleViewArticle(article)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ko'rish
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Current;