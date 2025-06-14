import React from 'react';
import { Download } from 'lucide-react';

const Current = () => {
  const currentIssue = {
    volume: 10,
    issue: 2,
    year: 2024,
    month: "Mart",
    articles: [
      {
        title: "Kvant kompyuterlari: kelajak texnologiyasi",
        authors: "A. Rahimov, B. Karimov",
        pages: "1-15",
        doi: "10.1234/journal.2024.001"
      },
      {
        title: "Sun'iy intellekt va ta'lim tizimi",
        authors: "M. Azizova, S. Qodirov",
        pages: "16-32",
        doi: "10.1234/journal.2024.002"
      },
      {
        title: "Yangi energiya manbalari tadqiqoti",
        authors: "D. Usmonov, F. Hakimov",
        pages: "33-48",
        doi: "10.1234/journal.2024.003"
      }
    ]
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Issue Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tom {currentIssue.volume}, Nashr {currentIssue.issue}
            </h1>
            <p className="text-lg text-gray-600">
              {currentIssue.month} {currentIssue.year}
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-8">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              To'liq nashrni yuklash (PDF)
            </button>
          </div>

          {/* Articles List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Maqolalar</h2>
            {currentIssue.articles.map((article, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {article.title}
                </h3>
                <div className="text-gray-600 mb-3">
                  Mualliflar: {article.authors}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>Sahifalar: {article.pages}</div>
                  <div>DOI: {article.doi}</div>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                    Maqolani o'qish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Current;