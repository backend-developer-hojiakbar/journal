import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Download, Calendar, FileText, User, Eye, ArrowLeft } from 'lucide-react';

interface Issue {
    id: number;
    title: string;
    cover_image: string;
    pdf_file: string;
    published_date: string;
    journal_type: string;
    journal_name: string;
    is_current: boolean;
    articles: Article[];
}

interface Article {
    id: number;
    pages: string;
    doi: string;
    authors: Author[];
    translations: Translation[];
    views: number;
    article_file: string;
}

interface Author {
    id: number;
    first_name: string;
    last_name: string;
    patronymic: string;
    orcid_id?: string;
    organization: string;
    position?: string;
}

interface Translation {
    language: string;
    title: string;
    abstract: string;
}

const JournalDetail = () => {
    const { journalType } = useParams<{ journalType: string }>();
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [journal, setJournal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>('all');

    useEffect(() => {
        const fetchJournalData = async () => {
            if (!journalType) return;
            
            setLoading(true);
            try {
                // Fetch journal info
                const journalsResponse = await apiClient.get('/journals/');
                const journalData = journalsResponse.data.find(
                    (j: any) => j.short_name.toLowerCase() === journalType.toLowerCase()
                );
                setJournal(journalData);

                // Fetch issues for this journal and sort by publication date (newest first)
                const issuesResponse = await apiClient.get(`/issues/?journal=${journalType}`);
                const sortedIssues = issuesResponse.data.sort((a: Issue, b: Issue) => 
                    new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
                );
                setIssues(sortedIssues);
            } catch (error) {
                console.error("Failed to fetch journal data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJournalData();
    }, [journalType]);

    // Get unique years from issues
    const years = ['all', ...new Set((issues || []).map(issue => 
        new Date(issue.published_date).getFullYear().toString()
    ))].sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;
        return parseInt(b) - parseInt(a);
    });

    // Filter issues by selected year
    const filteredIssues = selectedYear === 'all' 
        ? (issues || []) 
        : (issues || []).filter(issue => 
            new Date(issue.published_date).getFullYear().toString() === selectedYear
        );

    const handleArticleClick = (articleId: number) => {
        navigate(`/article/${articleId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Jurnal ma'lumotlari yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!journal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Jurnal topilmadi</h2>
                    <button 
                        onClick={() => navigate('/archive')} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Arxivga qaytish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/archive')} 
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Arxivga qaytish
                    </button>
                    
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{journal.name}</h1>
                                <p className="text-xl text-gray-600">Jurnal kodi: {journal.short_name}</p>
                                <p className="text-lg text-gray-500 mt-2">Jami {(issues || []).length} ta nashr</p>
                            </div>
                            <div className="text-right">
                                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold">
                                    {journal.short_name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year Filter */}
                {years.length > 1 && (
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        selectedYear === year
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {year === 'all' ? 'Barcha yillar' : `${year} yil`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Issues Grid */}
                {filteredIssues.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Bu jurnal uchun nashrlar topilmadi</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredIssues.map((issue) => (
                            <div key={issue.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="md:flex">
                                    {/* Issue Cover */}
                                    <div className="md:w-1/4 lg:w-1/5">
                                        <div className="aspect-[210/297] md:h-80">
                                            <img 
                                                src={issue.cover_image} 
                                                alt={issue.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Issue Content */}
                                    <div className="md:w-3/4 lg:w-4/5 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h2>
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span>{new Date(issue.published_date).toLocaleDateString('uz-UZ')}</span>
                                                </div>
                                                {issue.is_current && (
                                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Joriy nashr
                                                    </span>
                                                )}
                                            </div>
                                            <a 
                                                href={issue.pdf_file} 
                                                download
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Yuklab olish
                                            </a>
                                        </div>

                                        {/* Articles List */}
                                        {issue.articles && issue.articles.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Maqolalar ({issue.articles.length})
                                                </h3>
                                                <div className="space-y-3">
                                                    {(issue.articles || []).map((article) => {
                                                        const articleTranslations = article.translations || [];
                                                        const primaryTranslation = articleTranslations.find(t => t.language === 'uz') 
                                                                                  || articleTranslations[0];
                                                        const articleAuthors = article.authors || [];
                                                        
                                                        return (
                                                            <div 
                                                                key={article.id}
                                                                onClick={() => handleArticleClick(article.id)}
                                                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                            >
                                                                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                                    {primaryTranslation?.title || `Maqola ID: ${article.id}`}
                                                                </h4>
                                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                                    {articleAuthors.length > 0 && (
                                                                        <div className="flex items-center">
                                                                            <User className="w-4 h-4 mr-1" />
                                                                            <span>
                                                                                {articleAuthors.map(author => {
                                                                                    const fullName = `${author.last_name} ${author.first_name?.charAt(0) || ''}.`;
                                                                                    return author.patronymic ? `${fullName} ${author.patronymic?.charAt(0)}.` : fullName;
                                                                                }).join(', ')}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center">
                                                                        <FileText className="w-4 h-4 mr-1" />
                                                                        <span>Sahifalar: {article.pages || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        <span>{article.views || 0} ko'rishlar</span>
                                                                    </div>
                                                                    {article.doi && (
                                                                        <div className="text-blue-600">
                                                                            DOI: {article.doi}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalDetail;