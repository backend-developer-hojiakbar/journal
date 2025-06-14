import React from 'react';
import { Search } from 'lucide-react';

const Archive = () => {
  const archives = [
    {
      year: 2025,
      issues: [
        {
          id: 1,
          title: "Agriculture Today",
          subtitle: "Agriculture as the 1st Engine",
          date: "AT February 2025",
          image: "https://via.placeholder.com/150x200?text=Feb+2025", // Default rasm
          articleCount: 12,
        },
      ],
    },
    {
      year: 2024,
      issues: [
        {
          id: 2,
          title: "Agriculture Today",
          subtitle: "2025 The Path Ahead",
          date: "AT January 2025",
          image: "https://via.placeholder.com/150x200?text=Jan+2025", // Default rasm
          articleCount: 10,
        },
        {
          id: 3,
          title: "Agriculture Today",
          subtitle: "Agro Commodity Trail",
          date: "AT December 2024",
          image: "https://via.placeholder.com/150x200?text=Dec+2024", // Default rasm
          articleCount: 11,
        },
        {
          id: 4,
          title: "Agriculture Today",
          subtitle: "Redefining Fertilizers",
          date: "AT November 2024",
          image: "https://via.placeholder.com/150x200?text=Nov+2024", // Default rasm
          articleCount: 9,
        },
        {
          id: 5,
          title: "Agriculture Today",
          subtitle: "Farm Mechanization",
          date: "AT October 2024",
          image: "https://via.placeholder.com/150x200?text=Oct+2024", // Default rasm
          articleCount: 13,
        },
        {
          id: 6,
          title: "Agriculture Today",
          subtitle: "Horticulture Paving the Way",
          date: "AT September 2024",
          image: "https://via.placeholder.com/150x200?text=Sep+2024", // Default rasm
          articleCount: 12,
        },
        {
          id: 7,
          title: "Agriculture Today",
          subtitle: "Navigating Agriculture Climate Challenges",
          date: "AT August 2024",
          image: "https://via.placeholder.com/150x200?text=Aug+2024", // Default rasm
          articleCount: 10,
        },
        {
          id: 8,
          title: "Agriculture Today",
          subtitle: "100 Years of Agriculture",
          date: "AT July 2024",
          image: "https://via.placeholder.com/150x200?text=Jul+2024", // Default rasm
          articleCount: 11,
        },
      ],
    },
    {
      year: 2023,
      issues: [
        {
          id: 9,
          title: "Agriculture Today",
          subtitle: "Sample Issue 1",
          date: "AT December 2023",
          image: "https://via.placeholder.com/150x200?text=Dec+2023", // Default rasm
          articleCount: 14,
        },
        {
          id: 10,
          title: "Agriculture Today",
          subtitle: "Sample Issue 2",
          date: "AT November 2023",
          image: "https://via.placeholder.com/150x200?text=Nov+2023", // Default rasm
          articleCount: 12,
        },
      ],
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Jurnal arxivi</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Arxivdan qidirish..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Archive List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {archives.flatMap((year) =>
            year.issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{issue.subtitle}</p>
                  <p className="text-xs text-gray-500 mb-2">{issue.date}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {issue.articleCount} maqola
                  </span>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                    Ko‘rish →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive;