import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const JournalInfo = () => {
    const [latestYear, setLatestYear] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestYear = async () => {
            try {
                const response = await apiClient.get('/issues/latest-year/');
                if (response.data.success) {
                    setLatestYear(response.data.year);
                }
            } catch (error) {
                console.error("Failed to fetch latest year", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestYear();
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
                            «O'zbekiston qishloq va suv xo'jaligi» jurnali 1906-yildan, «Agro ilm» jurnali esa 2007-yildan buyon chop etilib kelinmoqda.
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

                {loading && (
                    <div className="mt-12 text-center py-8">
                        <p className="text-gray-600">So'nggi nashr yili yuklanmoqda...</p>
                    </div>
                )}
                
                {!loading && !latestYear && (
                    <div className="mt-12 text-center py-8">
                        <div className="bg-gray-100 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">So'nggi nashrlar</h4>
                            <p className="text-gray-600">Hozircha nashrlar mavjud emas.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalInfo;