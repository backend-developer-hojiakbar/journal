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
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">TAHRIRIYAT</h1>
          
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
          
          <div>
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
          
          {/* Debug Information
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Debug ma'lumotlari:</h3>
            <p className="text-yellow-700 text-sm">QX Board count: {qxBoard.length}</p>
            <p className="text-yellow-700 text-sm">AI Board count: {aiBoard.length}</p>
            <p className="text-yellow-700 text-sm">API endpoint: /board-members/ (barcha a'zolar)</p>
            <p className="text-yellow-700 text-sm">Filter: journal_short_name = 'qx' yoki 'ai'</p>
            <div className="mt-2">
              <p className="text-yellow-700 text-xs">Console loglarni tekshiring. Agar ma'lumotlar ko'rinmasa:</p>
              <ul className="text-yellow-700 text-xs ml-4 list-disc">
                <li>Admin panelda tahririyat a'zolarini qo'shing</li>
                <li>Journal maydonini to'g'ri tanlang (QX yoki AI)</li>
                <li>Browser consoleni tekshiring</li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default About;