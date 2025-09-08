import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Calendar, BookOpen, Download } from 'lucide-react';

interface Issue {
    id: number;
    title: string;
    cover_image: string;
    pdf_file: string;
    published_date: string;
    journal_type: string;
    journal_name: string;
    is_current: boolean;
}

const RecentIssues = () => {
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentIssues = async () => {
            try {
                // Fetch all issues and sort by publication date
                const response = await apiClient.get('/issues/');
                const allIssues = response.data;
                
                // Sort by published_date descending and take the latest 8 issues
                const sortedIssues = allIssues
                    .sort((a: Issue, b: Issue) => 
                        new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
                    )
                    .slice(0, 8);
                
                setRecentIssues(sortedIssues);
            } catch (error) {
                console.error("Failed to fetch recent issues", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentIssues();
    }, []);

    const handleIssueClick = (issue: Issue) => {
        navigate(`/journal/${issue.journal_type.toLowerCase()}`);
    };

    const formatIssueTitle = (issue: Issue) => {
        const year = new Date(issue.published_date).getFullYear();
        // Extract issue number from title (e.g., "7-son, 2025" -> "№7")
        const match = issue.title.match(/(\d+)-son/i) || issue.title.match(/№(\d+)/i) || issue.title.match(/(\d+)/);
        const issueNumber = match ? match[1] : '1';
        return `${year} – №${issueNumber}`;
    };

    if (loading) {
        return (
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">So'nggi nashrlar yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        So'nggi nashrlar
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Eng yangi chop etilgan jurnallar va nashrlarni ko'ring
                    </p>
                </div>

                {/* Recent Issues as Simple Cards */}
                {recentIssues.length > 0 ? (
                    <div className="space-y-8">
                        {/* Simple green-bordered cards like in screenshot */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {recentIssues.slice(0, 4).map((issue) => (
                                <div
                                    key={issue.id}
                                    onClick={() => handleIssueClick(issue)}
                                    className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                                >
                                    <div className="bg-white rounded-lg shadow-sm border-2 border-green-400 hover:border-green-500 hover:shadow-md transition-all px-6 py-4 min-w-[140px]">
                                        <div className="text-center">
                                            <h3 className="text-green-700 font-bold text-lg">
                                                {formatIssueTitle(issue)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="text-center">
                            <button
                                onClick={() => navigate('/archive')}
                                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Barcha nashrlarni ko'rish
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Hozircha nashrlar mavjud emas</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentIssues;