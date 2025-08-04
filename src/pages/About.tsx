import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const About = () => {
  const [qxBoard, setQxBoard] = useState([]);
  const [aiBoard, setAiBoard] = useState([]);

  useEffect(() => {
    const fetchBoard = async (journalShortName, setter) => {
      try {
        const response = await apiClient.get(`/board-members/?journal=${journalShortName}`);
        setter(response.data);
      } catch (error) {
        console.error(`Failed to fetch board for ${journalShortName}`, error);
      }
    };

    fetchBoard('QX', setQxBoard);
    fetchBoard('AI', setAiBoard);
  }, []);
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">TAHRIRIYAT</h1>
          <div className="text-center mb-10">
            <p className="text-lg text-gray-700"><strong>Muassis:</strong> O‘zbekiston Respublikasi Qishloq xo'jaligi va Suv xo'jaligi vazirliklari</p>
            <p className="text-lg text-gray-700 mt-2"><strong>Bosh muharrir:</strong> Tohir DOLIYEV</p>
            <p className="text-lg text-gray-700 mt-2"><strong>Mas'ul kotib:</strong> Ulug'bek MAMAJONOV</p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">"O‘zbekiston qishloq va suv xo‘jaligi” jurnali Tahrir hay`ati a`zolari</h2>
            <div className="space-y-4">
              {qxBoard.map((member: any, index) => (
                <div key={index} className="border-b border-gray-200 pb-3">
                  <p className="text-gray-800 font-semibold">{member.full_name}</p>
                  <p className="text-gray-600 text-sm">{member.position_description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">"Agro ilm” jurnali Tahrir hay`ati a`zolari</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {aiBoard.map((member: any, index) => (
                <p key={index} className="text-gray-700">{member.full_name}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;