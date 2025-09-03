import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const JournalInfo = () => {
    const [recentIssues, setRecentIssues] = useState([]);

    useEffect(() => {
        const fetchRecentIssues = async () => {
            try {
                const response = await apiClient.get('/recent-issues/');
                setRecentIssues(response.data);
            } catch (error) {
                console.error("Failed to fetch recent issues", error);
            }
        };
        fetchRecentIssues();
    }, []);

    const fanlar = [
        { code: "03.00.00", subject: "Biologiya fanlari" },
        { code: "05.00.00", subject: "Texnika fanlari" },
        { code: "06.00.00", subject: "Qishloq xo'jaligi fanlari" },
        { code: "08.00.00", subject: "Iqtisodiyot fanlari" },
        { code: "16.00.00", subject: "Veterinariya fanlari" },
    ];

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        “O'zbekiston qishloq va suv xo‘jaligi” va “Agro ilm” jurnallari
                    </h2>
                    <div className="mt-4 max-w-4xl mx-auto text-gray-600 space-y-3 text-lg">
                        <p>Muassis: O‘zbekiston Respublikasi Qishloq xo'jaligi va Suv xo'jaligi vazirliklari</p>
                        <p>Bosh muharrir: Tohir DOLIYEV</p>
                        <p className="text-base mt-6">
                            «O'zbekiston qishloq va suv xo'jaligi» jurnali 1906-yildan, «Agro ilm» jurnali esa 2007-yildan buyon chop etilib kelinmoqda...
                        </p>
                        <p className="text-base">
                            Jurnallarimiz O‘zbekiston Respublikasi Oliy attestatsiya komissiyasi Rayosatining qarori bilan quyidagi fanlar bo‘yicha ilmiy jurnallar ro‘yxatiga kiritilgan.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        {fanlar.map((fan, index) => (
                            <div key={index} className={`flex justify-between items-center p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${index !== fanlar.length - 1 ? "border-b border-gray-300" : ""}`}>
                                <span className="text-lg font-medium text-gray-900">{fan.code}</span>
                                <span className="text-lg text-gray-900">{fan.subject}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {recentIssues.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl text-center font-semibold text-gray-900">So'nggi nashrlar:</h3>
                        <div className="mt-4 flex flex-wrap justify-center gap-4">
                            {recentIssues.map((issue: any, index: number) => (
                                <a key={index} href={`/archive/#issue-${issue.link_to_issue}`} className="px-6 py-3 border border-green-600 rounded-md text-base font-medium text-green-700 hover:bg-green-50 transition-all">
                                    {issue.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalInfo;