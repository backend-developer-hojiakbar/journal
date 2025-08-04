import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const NewsSection = () => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await apiClient.get('/news/');
        if (response.data && response.data.length > 0) {
          setLatestNews(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);
  
  if (loading) return <div className="py-16 text-center">Yangiliklar yuklanmoqda...</div>;
  if (!latestNews) return null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Yangiliklar
          </h2>
          <div className="mt-2 w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
          {latestNews.image && (
            <div className="md:w-2/5">
              <img 
                src={latestNews.image} 
                alt={latestNews.title}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
          )}
          <div className={latestNews.image ? "md:w-3/5" : "w-full"}>
            <h3 className="font-bold text-xl mb-4">{latestNews.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{latestNews.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;