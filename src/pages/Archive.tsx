import React from 'react';
import { Search } from 'lucide-react';

const archives = [
  {
    id: 1,
    title: "O'zbekiston Qishloq va Suv Xo'jaligi",
    issue: "№ 7, 2024",
    image: "/archive/qxj-7-2024.jpg",
    pdfUrl: "#"
  },
  {
    id: 2,
    title: "Agro Ilm",
    issue: "№ 3, 2024",
    image: "/archive/ai-3-2024.jpg",
    pdfUrl: "#"
  },
  {
    id: 3,
    title: "O'zbekiston Qishloq va Suv Xo'jaligi",
    issue: "№ 6, 2024",
    image: "/archive/qxj-6-2024.jpg",
    pdfUrl: "#"
  },
  {
    id: 4,
    title: "Agro Ilm",
    issue: "№ 2, 2024",
    image: "/archive/ai-2-2024.jpg",
    pdfUrl: "#"
  },
];

const Archive = () => {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Jurnallar arxivi</h1>

        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Arxivdan qidirish..."
              className="w-full px-4 py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {archives.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={issue.image}
                  alt={`${issue.title} - ${issue.issue}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-md font-semibold text-gray-800">{issue.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{issue.issue}</p>
                <a 
                  href={issue.pdfUrl} 
                  download
                  className="inline-block w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  Yuklab olish
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;