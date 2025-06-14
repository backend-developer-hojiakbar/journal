// src/components/Articles.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText } from 'lucide-react';

const Articles = () => {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: "КОЛОРАДО КУЧНИЧИ (Leptinotarsa decemlineata Say)ГА КАРШИ КУРАШДА УЧИНЧИ ХАЕТ ЛИЧИНКАЛАРИ МУХИМ БУФУНЧИЛАРИН ХИСОБА ОЛИШ",
      authors: ["Sulaymonov Otabek", "Zokirov I I"],
      date: "2020-01-05",
      views: 841,
      pages: "11-15",
      abstract: "In the central Fergana region, potato agrogene is full of colorado beetle life cycle. This species is easily adapted to the steppes and maintains its viability. During its lifetime, the density of the imagine and larvae is high. On the contrary, their massive egglaying and excretion exacerbates weaknesses in the life cycle of the species. There was created high effective method against pests.",
      doi: "10.1234/journal.2020.001",
    },
    {
      id: 2,
      title: "ЯНГИ ВАКСИНАЛАРНИ ИШЛАБ ЧИҚАРИШДА БИОТЕХНОЛОГИЯ УСУЛЛАРИ",
      authors: ["Dr. Aziz Rahimov"],
      date: "2024-03-15",
      views: 632,
      pages: "16-20",
      abstract: "Ушбу мақолада янги вакциналарни ишлаб чиқаришда биотехнология усулларининг аҳамияти ва уларнинг амалий қўлланиши ҳақида сўз боради. Тадқиқотда биотехнология усулларининг иммунитет тизимига таъсири кўриб чиқилди.",
      doi: "10.1234/journal.2024.001",
    },
    {
      id: 3,
      title: "ФАРМАЦЕВТИКА СОҲАСИДАГИ ИННОВАЦИЯЛАР: ЯНГИ ДОРИ ВОСИТАЛАРИ",
      authors: ["Prof. Malika Karimova"],
      date: "2024-03-14",
      views: 497,
      pages: "21-25",
      abstract: "Мақолада фармацевтика соҳасидаги сўнгги инновациялар ва янги дори воситаларини ишлаб чиқаришдаги замонавий ёндашувлар кўриб чиқилган. Бу усулларнинг тиббиётдаги аҳамияти таҳлил қилинган.",
      doi: "10.1234/journal.2024.002",
    },
    {
      id: 4,
      title: "ИММУНИТЕТ ТИЗИМИНИ КУЧАЙТИРИШДА ВАКСИНАЛАРНИНГ РОЛИ",
      authors: ["Dr. Jamshid Toshpulatov"],
      date: "2024-03-13",
      views: 753,
      pages: "26-30",
      abstract: "Ушбу тадқиқотда иммунитет тизимини кучайтиришда вакциналарнинг роли ва уларнинг узоқ муддатли таъсири ўрганилди. Вакциналарнинг самарадорлигига оид тажрибалар натижалари келтирилган.",
      doi: "10.1234/journal.2024.003",
    },
  ];

  const handleView = (id) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Илмий мақолалар</h1>

        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{article.authors.join(" | ")}</span>
                <span className="mx-2">|</span>
                <FileText className="h-4 w-4 mr-1" />
                <span>{article.pages}</span>
                <span className="mx-2">|</span>
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.views}</span>
                <span className="mx-2">|</span>
                <span>{new Date(article.date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })} {new Date(article.date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-blue-600">Аннотация:</span> {article.abstract}
              </p>
              <button
                onClick={() => handleView(article.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Кўриш
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              Oldingi
            </button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
              Keyingi
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Articles;