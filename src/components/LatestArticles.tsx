import React from 'react';

const LatestArticles = () => {
  const articles = [
    {
      title: "Zamonaviy texnologiyalar va ilm-fan",
      author: "Dr. Aziz Rahimov",
      date: "2024-03-15",
      category: "Texnologiya",
      excerpt: "Zamonaviy texnologiyalarning ilm-fanga ta'siri va kelajak istiqbollari haqida...",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Tibbiyot sohasidagi yangi kashfiyotlar",
      author: "Prof. Malika Karimova",
      date: "2024-03-14",
      category: "Tibbiyot",
      excerpt: "So'nggi yillarda tibbiyot sohasida amalga oshirilgan muhim kashfiyotlar...",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Ekologik muammolar yechimlari",
      author: "Dr. Jamshid Toshpulatov",
      date: "2024-03-13",
      category: "Ekologiya",
      excerpt: "Global ekologik muammolarni hal qilishning innovatsion usullari...",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            So'nggi maqolalar
          </h2>
          <div className="mt-3 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500 sm:mt-4">
              Eng so'nggi ilmiy maqolalar va tadqiqotlar
            </p>
            <div className="mt-2 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex-1">
                  <p className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {article.category}
                  </p>
                  <a href="#" className="block mt-3">
                    <p className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {article.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {article.excerpt}
                    </p>
                  </a>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {article.author}
                    </p>
                    <time className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString('uz-UZ')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestArticles;