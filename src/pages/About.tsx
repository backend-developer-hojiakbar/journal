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
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">JURNAL TALABLARI</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">1. ETIKA ME’YORLARI VA MUALLIFLIK HUQUQI</h3>
                <p className="text-gray-700 mb-3">
                  Tahririyatga taqdim etilgan materiallar ilgari boshqa nashrlarda chop etilgan yoki boshqa nashrlarda ko‘rib chiqilayotgan bo‘lmasligi kerak. Shuning uchun muallif tahririyatga ushbu shaklda nashr etish uchun taqdim etgan materialini barcha hammualliflar va ish bajarilgan tashkilot nomidan kafolatlanishi lozim. Nashrga qabul qilingan maqolani jurnal tahririyatining yozma roziligisiz ularni boshqa tillarga tarjima qilib takroran chop etmaslik kafolatini oladi. Shuningdek, muallif jurnalning etika me’yorlari bilan tanishganligi, roziligi va keltirilgan barcha mas’uliyatlarni zimmasiga olganligini tasdiqlanishi darkor.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">2. «O‘ZBEKISTON QISHLOQ VA SUV XO‘JALIGI»  va «AGRO ILM» JURNALLARIDA YORITILUVCHI MAVZULAR</h3>
                <p className="text-gray-700 mb-3">
                  Qishloq xo‘jaligi, veterinariya, texnika, iqtisodiyot, biologiya va kimyo fanlari hamda agrar sohada amalga oshirilayotgan islohotlar.
                </p>
                <p className="text-gray-700">
                  «O‘zbekiston qishloq va suv  xo‘jaligi» agrar iqtisodiy, ilmiy-ommabop va «Agro ilm» agrar iqtisodiy, ilmiy-amaliy jurnallari tahririyati tahririyatiga taqdim etilayotgan qo‘lyozma bo‘yicha muallif ilmiy-tadqiqot ishi olib borayotgan tashkilot rahbariyatining yo‘llanma xati, maqolani chop etish mumkinligi haqidagi ekspert xulosasi hamda taqriz bo‘lishi lozim.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">3. MAQOLANING YOZILISH TILI, TUZILISHI VA TARKIBI</h3>
                <p className="text-gray-700 mb-3">
                  Maqolalar o‘zbek, rus va ingliz tillarida qabul qilinadi. Maqola keng omma uchun tushunarli tilda, grammatika qoidalariga amal qilgan holda yozilgan bo‘lishi kerak. Maqola o‘zida muayyan ilmiy tadqiqotning tugal yechimlarini yoki uning bosqichlarini ifodalashi zarur. Sarlavha maqolaning mazmuni to‘g‘risida axborot bera olishi, imkon qadar qisqa bo‘lishi va umumiy so‘zlardan iborat bo‘lib qolmasligi kerak. Odatda ilmiy maqolada quyidagilar bo‘lishi kerak: universal o‘nlik tasnifi (UO‘T), maqolaning sarlavhasi, annotatsiyasi (uch tilda), kalit so‘zlar (uch tilda), kirish, ko‘rib chiqilayotgan muammoning hozirgi holatining tahlili va manbaalarga havolalar, masalaning qo‘yilishi, yechish usuli (uslublari), natijalar tahlili va misollar, xulosa, foydalanilgan adabiyotlar ro‘yxati, muallif(lar) to‘g‘risida ma’lumot. Maqolada odatda qabul qilingan atamalardan foydalanish, yangi atama kiritganda, albatta, uni aniq asoslab berish kerak. Fizik kattaliklarning o‘lchov birliklari Xalqaro o‘lchamlar tizimi (SI)ga mos bo‘lishi kerak. Jurnalga ilgari e’lon qilinmagan maqolalar qabul qilinadi. Maqolada muallif o‘zining ishlariga havolalar soni haddan ziyod oshirib yubormasligi, ko‘pi bilan 20-30 foizgacha bo‘lishi tavsiya etiladi. Tahririyat ko‘chirmachilik (plagiat), o‘zgalarning ishlarini o‘zlashtirib olishga salbiy qaraydi. Shuning uchun mualliflardan ishga jiddiy munosabatda bo‘lishi va havola qilish qoidalariga bo‘ysunishi: kvadrat qavs ichida bibliografik havolani qo‘yishni yoddan chiqarmasligi so‘raladi.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">4. MAQOLAGA QO‘YILADIGAN TEXNIK TALABLAR</h3>
                <p className="text-gray-700 mb-3">
                  Maqolaning sarlavhasi, muallif (lar) va u(lar)ning lavozimi, ilmiy darajasi va ish joyi, annotatsiya, kalit so‘zlar (uch tilda) bir ustunda yoziladi. Maqolaning qolgan matnlari ikki ustunda yoziladi. Maqola MS Word matn muharririda yozilishi va quyidagi ko‘rsatkichlarga muvofiq qat’iy rasmiylashtirilishi kerak: - A4 formatda, matn sahifasining chekkalarida 2 sm dan joy qoldiriladi, Times New Roman shriftida, maqola uchun shrift hajmi - 14 pt, jadvallar bundan mustasno, jadvallar uchun shrift hajmi - 12 pt, qator oralig‘i - 1,5 interval, matn sahifa kengligi bo‘yicha tekislanadi, xat boshi - 1 sm ("Tab" yoki "Probel" tugmalaridan foydalanmasdan).
                </p>
                <p className="text-gray-700 mb-3">
                  Quyidagilarga ruxsat etilmaydi: sahifalarni raqamlash, matnda sahifani avtomatik bo‘lishdan foydalanish, matnda avtomatik havolalardan foydalanish, avtomatik bo‘g‘in ko‘chirish, kamdan-kam hollarda ishlatiladigan yoki qisqartma harflarni qo‘llash.
                </p>
                <p className="text-gray-700 mb-3">
                  Jadvallar MS Word dasturida yoziladi. Jadvalning tartib raqami va nomi jadvalning yuqorisida yoziladi.
                </p>
                <p className="text-gray-700 mb-3">
                  Grafikli materiallar (rangli rasmlar, chizmalar, diagrammalar, fotosuratlar) o‘zida tadqiqotning umumlashtirilgan materiallarini ifodalashi kerak. Grafikli materiallar yuqori sifatli bo‘lishi kerak, agar zarurat tug‘ilsa, tahririyat ushbu materiallarni alohida faylda 300 dpi dan kam bo‘lmagan o‘lchamda jpg formatda taqdim etishni talab qilishi mumkin. Grafikli materialning nomi va tartib raqami pastki qismda keltirilishi zarur.
                </p>
                <p className="text-gray-700 mb-3">
                  Formulalar va matematik belgilar MS Wordda o‘rnatilgan formatli muharrirda yoki MathType muharriri yordamida bajarilishi kerak. Jadvallar, grafikli materiallar ko‘rsatilgan maydondan chiqib ketmasligi lozim.
                </p>
                <p className="text-gray-700 mb-3">
                  Muallif (lar) haqida ma’lumot: familiyasi, ismi, otasining ismi, lavozimi, ilmiy darajasi, ish joyi va ORCID raqami. Ushbu ma’lumotlar maqola taqdim etilgan tilda keltirilishi hamda maqolaning boshida – sarlavhadan keyin joylashtirilishi kerak.
                </p>
                <p className="text-gray-700 mb-3">
                  Annotatsiya (o‘zbek, rus, ingliz tillarida) – annotatsiya hajmi 50-100 ta so‘zdan iborat bo‘lishi lozim. Bunda tanlangan uslub, tadqiqot natijalari va xulosalar umumlashtirib maqolaning tuzilishini qisqacha ifodalovchi, axborot shaklida berilishi kerak.
                </p>
                <p className="text-gray-700 mb-3">
                  Kalit so‘zlar (o‘zbek, rus, ingliz tillarida) – 8-10 ta so‘z va iboralardan iborat bo‘lishi kerak. Kalit so‘zlar va iboralar bir-biridan vergul bilan ajratiladi. Keltirilgan kalit so‘zlar tadqiqot mavzusini juda aniq aks ettirishi shart.
                </p>
                <p className="text-gray-700 mb-3">
                  Kirish. Kirish qismida tadqiqotlarning dolzarbligi va ob’yekti tavsiflanadi. Dunyo olimlari tomonidan chop etilgan ilmiy maqolalarning tahlili keltiriladi. Chop etilgan adabiyot manbalarida qo‘yilgan ilmiy izlanishlarning yechimi yo‘qligi tasdiqlangan holda muallifning ilmiy ishlari qaysi olimlarning ishiga asoslanganligi ko‘rsatiladi.
                </p>
                <p className="text-gray-700 mb-3">
                  Materiallar va usullar (yoki uslublar). Bunda tanlangan usul batafsil tavsiflanadi. Keltirilgan yoki qo‘llanilgan uslub boshqa tadqiqotchilar uchun ham tushunishiga qulay bo‘lishi kerak. 
                </p>
                <p className="text-gray-700 mb-3">
                  Ushbu bo‘limda natijalarni olish uchun ishlatilgan usullar va metodlar keldiriladi. Birinchidan, odatda eksperimentlarning umumiy dizayni keltiriladi (design of the experiment). So‘ngra esa tajribalarning shu qadar batafsil yoritiladiki, har qanday vakolatli mutaxassis o‘z laboratoriyasida ushbu maqolaning matnidan foydalanib tajribalarni takrorlashi mumkin bo‘lishi kerak. Ko‘p mualliflar ushbu bo‘limni o‘tkazib yuboradilar. Taqrizchi qo‘lyozmani o‘qiyotganda, tadqiqot metodologiyasining qanchalik batafsil ekanligiga alohida e’tibor beradi. Agar taqrizchi yuqoridagi tavsifdan foydalanib tajribalarni takrorlash mumkinligiga shubha qilsa, katta erishilgan natijalarga qaramay, sizning maqolangizni jurnalda nashr etishga rad etishni tavsiya qiladi.
                </p>
                <p className="text-gray-700 mb-3">
                  Standart usullar, metodlar va proseduralardan foydalanganda tegishli manbalarga murojaat qilish maqsadga muvofiqdir. Agar standart usul va metodlar siz tomonidan o‘zgartirilgan bo‘lsa, standart usullarning modifikatsiyasini batafsil tavsiflash lozim. Agar siz ilgari hech qayerda nashr etilmagan o‘zingizning yangi usulingizdan foydalanayotgan bo‘lsangiz, hamma kerakli ma’lumotlarni berishingiz kerak. Agar siz ilgari o‘z tadqiqot usul va metodlaringizni jurnalda nashr etgan bo‘lsangiz, unda shu nashrlarga iqtibos (reference) bilan cheklanib qolishingiz mumkin.
                </p>
                <p className="text-gray-700 mb-3">
                  Agar sizning tadqiqotlaringiz biologiya bilan bog‘liq bo‘lsa, unda o‘simliklar, hayvonlar, viruslar va mikroorganizmlarning turlarini sinchkovlik bilan aniqlang va xalqaro nomini keltiring. Agar siz tadqiqotlarni insonlar ustida olib borgan bo‘lsangiz, shu insonlarning roziligi ham talab etiladi va maqola matnida keltiriladi (informed consent).
                </p>
                <p className="text-gray-700 mb-3">
                  Natijalar va munozara. Natijalarni asosan jadvallar, grafiklar va boshqa suratlar ko‘rinishida keltirish tavsiya etiladi. Ushbu bo‘lim olingan natijalarni tahlil qilish, ularni sharhlash, boshqa mualliflarning natijalari bilan solishtirishni o‘z ichiga oladi. Natijalarda ilmiy-tadqiqotlar natijalari qisqacha umumlashtiriladi. Natijalar tadqiqotning ob’yekti parametrlari o‘rtasidagi munosabatlar mualliflar tomonidan belgilangan maqolaning asosiy ilmiy natijalarini umumlashtiruvchi, sonli xulosalarni o‘z ichiga oladi. Natijalar maqola boshida qo‘yilgan vazifalar bilan mantiqan bog‘langan bo‘lishi kerak.
                </p>
                <p className="text-gray-700 mb-3">
                  Xulosa. Ilmiy ishlarining qisqa natijalari keltiriladi, ularning ichida izlanishning usuli, yangi yechimi, amaliyotda qo‘llanishning natijalari iqtisodiy va boshqa ko‘rsatkichlar bo‘lishi kerak.
                </p>
                <p className="text-gray-700 mb-3">
                  Adabiyotlar. Adabiyotlar ro‘yxati 10 tadan kam bo‘lmagan manbalardan iborat bo‘lishi kerak, topilishi qiyin bo‘lgan va normativ hujjatlar, bundan tashqari internet manbalarida keltirilgan havolalar (davriy hujjatlar hisobga olinmaydi) bundan mustasno. Adabiyotlar ro‘yxatiga darsliklar, o‘quv qo‘llanmalari kiritish mumkin emas. Ko‘pchilik adabiyotlar ingliz tilida so‘zlovchi xalqaro kitobxonlar uchun ochiq va tushunarli bo‘lishi kerak. Manbalarning ahamiyatliligiga qattiq talablar qo‘yiladi. Barcha manbalar maqolaning ichki qismida raqamlangan havola tarzida berilishi kerak. Matndagi havolalar kvadrat qavs ichida (masalan,  [7], [9, 10] ) keltiriladi. Barcha manbalarga matnda havolalar berilishi kerak, aks holda maqola qaytariladi.
                </p>
                <p className="text-gray-700">
                  Yuqoridagi talablarga javob bermaydigan maqolalar ko‘rib chiqishga qabul qilinmaydi va chop etishga tavsiya qilinmagan maqolalar mualliflarga qaytarilmaydi.
                </p>
                <p className="text-gray-700 mt-3">
                  Maqolalarda keltirilgan ma’lumotlarning haqqoniyligiga muallif(lar) javobgardir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;