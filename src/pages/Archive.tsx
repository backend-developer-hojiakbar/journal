import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Search, Calendar, Download, BookOpen, FileText, ArrowRight } from 'lucide-react';

interface Issue {
    id: number;
    title: string;
    cover_image: string;
    pdf_file: string;
    published_date: string;
    journal_type: string;
    journal_name: string;
    is_current: boolean;
    articles?: any[];
}

interface Journal {
    id: number;
    name: string;
    short_name: string;
    issues: Issue[];
}

const Archive = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJournal, setSelectedJournal] = useState<string>('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all issues
                const issuesResponse = await apiClient.get('/issues/');
                const issuesData = issuesResponse.data;
                setIssues(issuesData);

                // Fetch journals
                const journalsResponse = await apiClient.get('/journals/');
                const journalsData = journalsResponse.data;

                // Group issues by journal
                const journalsWithIssues = journalsData.map((journal: any) => ({
                    ...journal,
                    issues: (issuesData || []).filter((issue: Issue) => 
                        issue.journal_type === journal.short_name
                    ).sort((a: Issue, b: Issue) => 
                        new Date(a.published_date).getTime() - new Date(b.published_date).getTime()
                    )
                }));

                setJournals(journalsWithIssues);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleJournalClick = (journalType: string) => {
        navigate(`/journal/${journalType.toLowerCase()}`);
    };

    const handleIssueClick = (issue: Issue) => {
        navigate(`/journal/${issue.journal_type.toLowerCase()}`);
    };

    // Filter journals based on search and selection
    const filteredJournals = (journals || []).filter(journal => {
        const matchesSearch = journal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (journal.issues || []).some(issue => 
                                issue.title.toLowerCase().includes(searchTerm.toLowerCase())
                            );
        const matchesSelection = selectedJournal === 'all' || journal.short_name === selectedJournal;
        return matchesSearch && matchesSelection;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Arxiv yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Jurnallar arxivi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Barcha nashrlarni ko'ring, yuklab oling va maqolalarni o'qing
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Jurnal yoki nashr nomini qidiring..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Journal Filter */}
                        <div className="w-full lg:w-auto">
                            <select
                                value={selectedJournal}
                                onChange={(e) => setSelectedJournal(e.target.value)}
                                className="w-full lg:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Barcha jurnallar</option>
                                {(journals || []).map(journal => (
                                    <option key={journal.id} value={journal.short_name}>
                                        {journal.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Journal Cards */}
                {filteredJournals.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Hech qanday natija topilmadi</p>
                        <p className="text-gray-500 mt-2">Boshqa so'zlar bilan qidiring yoki filterni o'zgartiring</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredJournals.map((journal) => (
                            <div key={journal.id} className="bg-white rounded-xl shadow-xl overflow-hidden">
                                {/* Journal Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                {journal.name}
                                            </h2>
                                            <p className="text-blue-100 text-lg">
                                                Jami {(journal.issues || []).length} ta nashr mavjud
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-lg font-semibold mb-3">
                                                {journal.short_name}
                                            </div>
                                            <button
                                                onClick={() => handleJournalClick(journal.short_name)}
                                                className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                            >
                                                Batafsil ko'rish
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Issues Grid */}
                                {(!journal.issues || journal.issues.length === 0) ? (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-500">Bu jurnal uchun nashrlar mavjud emas</p>
                                    </div>
                                ) : (
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                            {(journal.issues || []).slice(0, 12).map((issue) => (
                                                <div 
                                                    key={issue.id} 
                                                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                                    onClick={() => handleIssueClick(issue)}
                                                >
                                                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                                                        {/* Issue Cover */}
                                                        <div className="aspect-[210/297] overflow-hidden relative">
                                                            <img 
                                                                src={issue.cover_image} 
                                                                alt={issue.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                            {issue.is_current && (
                                                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                                    Joriy
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Issue Info */}
                                                        <div className="p-3">
                                                            <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                                                                {issue.title}
                                                            </p>
                                                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                <span>{new Date(issue.published_date).toLocaleDateString('uz-UZ')}</span>
                                                            </div>
                                                            
                                                            {/* Action Buttons */}
                                                            <div className="space-y-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleIssueClick(issue);
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                                >
                                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                                    Ko'rish
                                                                </button>
                                                                <a 
                                                                    href={issue.pdf_file} 
                                                                    download
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-full px-3 py-2 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
                                                                >
                                                                    <Download className="w-3 h-3 mr-1" />
                                                                    Yuklab olish
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Show More Button */}
                                        {(journal.issues || []).length > 12 && (
                                            <div className="text-center mt-8">
                                                <button
                                                    onClick={() => handleJournalClick(journal.short_name)}
                                                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                                >
                                                    Ko'proq ko'rish ({(journal.issues || []).length - 12}+)
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;