import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiClient.get('/news/');
        if (response.data && response.data.length > 0) {
          setNews(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const goToNews = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (loading) return <div className="py-16 text-center">Yangiliklar yuklanmoqda...</div>;
  if (!news.length) return null;

  const currentNews = news[currentIndex];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Yangiliklar
          </h2>
          <div className="mt-2 w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="mt-12 relative">
          {/* Main News Display */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
            {currentNews.image && (
              <div className="md:w-2/5">
                <img 
                  src={currentNews.image} 
                  alt={currentNews.title}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            )}
            <div className={currentNews.image ? "md:w-3/5" : "w-full"}>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar size={16} className="mr-2" />
                {new Date(currentNews.created_at).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h3 className="font-bold text-xl mb-4">{currentNews.title}</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentNews.content}</p>
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than one news item */}
          {news.length > 1 && (
            <>
              <button
                onClick={prevNews}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Oldingi yangilik"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={nextNews}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Keyingi yangilik"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* News Indicators */}
        {news.length > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="flex gap-2">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToNews(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`${index + 1}-yangilikka o'tish`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {currentIndex + 1} / {news.length}
            </span>
          </div>
        )}

        {/* News List for Quick Access */}
        {news.length > 1 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Barcha Yangiliklar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => goToNews(index)}
                  className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    index === currentIndex ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar size={12} className="mr-1" />
                      {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                    </div>
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-3">
                      {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;