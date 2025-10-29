import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

interface BoardMember {
  id: number;
  full_name: string;
  position_description: string;
  role: string;
  order: number;
  journal_name?: string;
  journal_short_name?: string;
}

const About = () => {
  const [qxBoard, setQxBoard] = useState<BoardMember[]>([]);
  const [aiBoard, setAiBoard] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async (journalShortName: string, setter: (data: BoardMember[]) => void) => {
      try {
        console.log(`Fetching board members for: ${journalShortName}`);
        const response = await apiClient.get(`/board-members/?journal=${journalShortName}`);
        console.log(`Board members response for ${journalShortName}:`, response.data);
        
        // Sort by order and role
        const sortedMembers = (response.data || []).sort((a: BoardMember, b: BoardMember) => {
          // First sort by role priority
          const roleOrder = { 'bosh_muharrir': 1, 'masul_kotib': 2, 'hayat_azosi': 3 };
          const aRole = roleOrder[a.role as keyof typeof roleOrder] || 999;
          const bRole = roleOrder[b.role as keyof typeof roleOrder] || 999;
          
          if (aRole !== bRole) return aRole - bRole;
          return a.order - b.order;
        });
        
        setter(sortedMembers);
      } catch (error) {
        console.error(`Failed to fetch board for ${journalShortName}`, error);
        setError(`Tahririyat a'zolarini yuklashda xatolik: ${journalShortName}`);
      }
    };

    const fetchAllBoards = async () => {
      setLoading(true);
      setError(null);
      
      // Try both uppercase and lowercase, and also fetch all board members
      try {
        // First try to fetch all board members
        console.log('Fetching all board members...');
        const allResponse = await apiClient.get('/board-members/');
        console.log('All board members response:', allResponse.data);
        
        if (allResponse.data && allResponse.data.length > 0) {
          // Filter by journal_short_name
          const qxMembers = allResponse.data.filter((member: BoardMember) => 
            member.journal_short_name?.toLowerCase() === 'qx' || member.journal_short_name?.toLowerCase() === 'QX'.toLowerCase()
          );
          const aiMembers = allResponse.data.filter((member: BoardMember) => 
            member.journal_short_name?.toLowerCase() === 'ai' || member.journal_short_name?.toLowerCase() === 'AI'.toLowerCase()
          );
          
          // Sort members
          const sortMembers = (members: BoardMember[]) => members.sort((a, b) => {
            const roleOrder = { 'bosh_muharrir': 1, 'masul_kotib': 2, 'hayat_azosi': 3 };
            const aRole = roleOrder[a.role as keyof typeof roleOrder] || 999;
            const bRole = roleOrder[b.role as keyof typeof roleOrder] || 999;
            if (aRole !== bRole) return aRole - bRole;
            return a.order - b.order;
          });
          
          setQxBoard(sortMembers(qxMembers));
          setAiBoard(sortMembers(aiMembers));
        } else {
          // Fallback to individual journal requests
          await Promise.all([
            fetchBoard('qx', setQxBoard),
            fetchBoard('ai', setAiBoard),
            fetchBoard('QX', setQxBoard),
            fetchBoard('AI', setAiBoard)
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch all board members, trying individual requests:', error);
        // Fallback to individual requests
        await Promise.all([
          fetchBoard('qx', setQxBoard),
          fetchBoard('ai', setAiBoard)
        ]);
      }
      
      setLoading(false);
    };

    fetchAllBoards();
  }, []);
  
  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'bosh_muharrir': 'Bosh muharrir',
      'masul_kotib': "Mas'ul kotib",
      'hayat_azosi': "Hay'at a'zosi"
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };
  
  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Tahririyat ma'lumotlari yuklanmoqda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">JURNAL HAQIDA</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="text-center mb-10">
            <p className="text-lg text-gray-700"><strong>Muassis:</strong> O'zbekiston Respublikasi Qishloq xo'jaligi va Suv xo'jaligi vazirliklari</p>
            <p className="text-lg text-gray-700 mt-2"><strong>Bosh muharrir:</strong> Tohir DOLIYEV</p>
            <p className="text-lg text-gray-700 mt-2"><strong>Mas'ul kotib:</strong> Ulug'bek MAMAJONOV</p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">"O'zbekiston qishloq va suv xo'jaligi" jurnali Tahrir hay`ati a`zolari</h2>
            
            {qxBoard.length > 0 ? (
              <div className="space-y-4">
                {qxBoard.map((member, index) => (
                  <div key={member.id || index} className="border-b border-gray-200 pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold text-lg">{member.full_name}</p>
                        <p className="text-gray-600 mt-1">{member.position_description}</p>
                      </div>
                      <span className="mt-2 sm:mt-0 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getRoleDisplayName(member.role)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">"O'zbekiston qishloq va suv xo'jaligi" jurnali uchun tahririyat a'zolari ma'lumotlari topilmadi.</p>
                <p className="text-gray-400 text-sm mt-2">Admin panelda tahririyat a'zolarini qo'shing.</p>
              </div>
            )}
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">"Agro ilm" jurnali Tahrir hay`ati a`zolari</h2>
            
            {aiBoard.length > 0 ? (
              <div className="space-y-4">
                {aiBoard.map((member, index) => (
                  <div key={member.id || index} className="border-b border-gray-200 pb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold text-lg">{member.full_name}</p>
                        <p className="text-gray-600 mt-1">{member.position_description}</p>
                      </div>
                      <span className="mt-2 sm:mt-0 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {getRoleDisplayName(member.role)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">"Agro ilm" jurnali uchun tahririyat a'zolari ma'lumotlari topilmadi.</p>
                <p className="text-gray-400 text-sm mt-2">Admin panelda tahririyat a'zolarini qo'shing.</p>
              </div>
            )}
          </div>
          
          {/* Journal Requirements Section - Moved to the bottom */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Jurnal Talablari</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Maqola Talablari</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Maqola hajmi 8-12 bet (15 000-20 000 belgi) bo'lishi kerak</li>
                  <li>Maqola uch tilga (o'zbek, rus, ingliz) tarjima qilinishi shart</li>
                  <li>Maqolada 15-20 ta ilmiy manba bo'lishi kerak</li>
                  <li>Maqola DOC yoki DOCX formatda yuborilishi kerak</li>
                  <li>Maqola PDF formatda ham yuborilishi kerak</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Muallif Talablari</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Muallif ORCID ID ga ega bo'lishi tavsiya etiladi</li>
                  <li>Muallifning to'liq F.I.SH. ko'rsatilishi kerak</li>
                  <li>Muallifning ilmiy darajasi va unvoni ko'rsatilishi kerak</li>
                  <li>Muallifning ish joyi va lavozimi ko'rsatilishi kerak</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Formatlash Talablari</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Shrift: Times New Roman, 12 punkt</li>
                  <li>Qatorlar orasi: 1.5</li>
                  <li>Chapdan chegara: 3 sm, o'ngdan chegara: 2 sm</li>
                  <li>Yuqoridan chegara: 2 sm, pastdan chegara: 2 sm</li>
                  <li>Raqamlar uch xonalik guruhlarga ajratiladi</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Yuborish Talablari</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Maqola ilmiy-redaktor tomonidan ko'rib chiqiladi</li>
                  <li>Maqola plagiat tekshiruvidan o'tkaziladi</li>
                  <li>Maqola muvaffaqiyatli qabul qilinsa, muallifga xabar beriladi</li>
                  <li>Maqola chop etilgach, muallifga PDF nusxasi yuboriladi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;