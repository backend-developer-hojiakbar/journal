import React from 'react';

const tahririyatQX = [
  { name: "Abduraxmonov Ibrohim Yulchiyevich", details: "O‘zbekiston Respublikasi Qishloq xo‘jaligi vaziri, biologiya fanlari doktori, akademik" },
  { name: "Xamrayev Shavkat Raximovich", details: "O‘zbekiston Respublikasi Suv xo‘jaligi vaziri, qishloq xo‘jalik fanlari nomzodi" },
  { name: "Tuychiyev Anvar Mirzaaxmedovich", details: "O'zbekiston Respublikasi Oliy Majlisi Senatining Agrar, suv xo‘jaligi masalalari va ekologiya qo‘mitasi raisi" },
  { name: "Mamutov Ravshan Aminaddinovich", details: "Oʼzbekiston Respublikasi Oliy Majlisi Qonunchilik palatasining Аgrar va suv xoʼjaligi masalalari qoʼmitasi raisi" },
  { name: "Namozov Shodmon Ergashevich", details: "Qishloq xo‘jaligida bilim va innovatsiyalar milliy markazi direktori, qishloq xo‘jalik fanlari doktori, akademik" },
  { name: "Vahobov Abrol Jabarovich", details: "Bosh vazirning agrar va oziq-ovqat sohalarini rivojlantirish masalalari bo‘yicha maslahatchisi" },
  { name: "Norqobilov Bahromjon Toʻrayevich", details: "Veterinariya va chorvachilikni rivojlantirish davlat qoʻmitasi raisi, veterinariya fanlari doktori, professor" },
  { name: "Teshayev Shuhrat Jo‘raqulovich", details: "Qoraqalpog'iston Respublikasi Vazirlar Kengashi raisining qishloq va suv masalalari bo'yicha o'rinbosari, qishloq xo‘jaligi fanlari doktori, professor" },
  { name: "Mirzaev Bahodir Suyunovich", details: "“Toshkent irrigatsiya va qishloq xoʻjaligini mexanizatsiyalash muxandislari instituti“ Milliy tadqiqot universiteti rektori, texnika fanlari doktori, professor" },
  { name: "Oblomuradov Narzullo Naimovich", details: "Toshkent davlat agrar universiteti rektori,  iqtisod fanlari doktori, professor" },
  { name: "Siddiqov Ravshanbek Inomjonovich", details: "Don va dukkakli ekinlar ilmiy-tadqiqot instituti direktori, qishloq xoʻjaligi fanlari doktori, professor" },
  { name: "Yunusov Xudaynazar Beknazarovich", details: "Samarqand davlat veterinariya meditsinasi, chorvachilik va biotexnologiyalar universiteti rektori, biologiya fanlari doktori, professor" },
  { name: "Mirsaidov Mirziyod Mirsaidovich", details: "Oʻzbekiston Fanlar akademiyasi akademigi, texnika fanlari doktori, professor" },
  { name: "Ergashev Ibrohim Kenjaboyevich", details: "Oʻsimliklar karantini va himoyasi agentligi bosh direktori" },
];

const tahririyatAI = [
  "Shodmon NAMOZOV (Hay’at raisi)", "Maxfurat AMANOVA", "Sayfulla AXMEDOV", "Ma’muraxon ATABAYEVA", "Qobiljon AZIZOV", "Shuxrat BOBOMURODOV", "Qalandar BOBOBEKOV", "Asadullo DAMINOV", "Dilorom YORMATOVA", "Shuxrat JABBOROV", "Abdirasuli IBRAGIMOV", "Odiljon IBRAGIMOV", "Uzakbay ISMAYLOV", "Baxodir ISROILOV", "Sanoatxon ZOKIROVA", "Abdulla MADALIYEV", "Bunyod MAMARAXIMOV", "Abbosxon MA`RUPOV", "Rustam NIZOMOV", "Ruziboy NORMAXMATOV", "Toshtemir OSTONAQULOV", "Shuxrat OTAJONOV", "Faxriddin RASULOV", "Shuxrat RIZAYEV", "Sobir SANAYEV", "Mas’ud SATTOROV", "Yelmurat TORENIYAZOV", "Dilbar TUNGUSHOVA", "Ruzimbay TURGANBAYEV", "Abdusalim TO‘XTAQO‘ZIYEV", "To‘lqin FARMONOV", "Baxodir XOLIQOV", "Do‘stmuhammad XOLMIRZAYEV", "Ne`matulla XUDAYBERGANOV", "Norqul XUSHMATOV", "Rashid HAKIMOV", "Feruza HASANOVA", "Akrom HOSHIMOV", "Dilfuza EGAMBERDIYEVA", "Abdug‘ani ELMURODOV", "Shamsi ESANBAYEV", "Islom QO‘ZIYEV"
];

const About = () => {
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
              {tahririyatQX.map((member, index) => (
                <div key={index} className="border-b border-gray-200 pb-3">
                  <p className="text-gray-800 font-semibold">{member.name}</p>
                  <p className="text-gray-600 text-sm">{member.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">"Agro ilm” jurnali Tahrir hay`ati a`zolari</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {tahririyatAI.map((name, index) => (
                <p key={index} className="text-gray-700">{name}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Maqolalar uchun talablar</h2>
          <p className="text-gray-600 mb-4">
            “O‘zbekiston qishloq va suv xo‘jaligi” hamda “Agro ilm” jurnallarida maqola chop etish uchun qo‘yiladigan
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">TALABLAR</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Maqolalar o‘zbek, rus yoki ingliz tillarida taqdim etilishi mumkin.</li>
            <li>
              Taqdim etilayotgan ilmiy maqola mavzusi “O‘zbekiston zamini” ilmiy-amaliy va innovatsion jurnalining ruknlariga mos kelishi shart.
            </li>
            <li>
              O‘zbek tilidagi maqolalar lotin yozuviga asoslangan o‘zbek alifbosida yozilishi va taqdim etilishi maqsadga muvofiq bo‘ladi.
            </li>
            <li>
              Maqola xalqaro andozalarga muvofiq quyidagi talablarga javob berishi lozim:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Maqola mavzusi</li>
                <li>Maqola muallif(lar)i to‘g‘risida ma’lumot</li>
                <li>Maqola annotatsiyasi</li>
                <li>Kalit so‘zlar</li>
                <li>Kirish</li>
                <li>Mavzuga oid adabiyotlar tahlili</li>
                <li>Tadqiqot metodologiyasi</li>
                <li>Tahlil va natijalar</li>
                <li>Xulosa va takliflar</li>
                <li>Foydalanilgan adabiyotlar ro‘yxati</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">Maqolani rasmiylashtirishga qo‘yiladigan talablar:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Matn – Microsoft Word -2003.</li>
            <li>
              Maqola matni chapdan – 3 sm, o‘ngdan – 1,5 sm, yuqori va pastdan – 2 sm qoldiriladi.
            </li>
            <li>Shrift – Times New Roman.</li>
            <li>Maqola matni shriftining kattaligi – 14;</li>
            <li>Qatorlar oralig‘i – 1,5;</li>
            <li>Xat boshi – 1,25.</li>
            <li>
              Muallifning ismi, familiyasi, otasining ismi, ish joyi (o‘qish joyi), lavozimi, elektron pochta manzili haqidagi ma’lumot maqola yuqori qismining o‘ng tarafiga kichik harflarda, o‘zbek, rus, ingliz tillarida, kursiv (Shriftning kattaligi - 14. Qatorlar oralig‘i (interval) – 1) bilan yoziladi.
            </li>
            <li>
              Maqolaning nomi o‘zbek, rus, ingliz tillarida (Shriftning kattaligi – 14) – bosma harflarda markazda qo‘yiladi.
            </li>
            <li>
              Qisqacha annotatsiya o‘zbek, rus, ingliz tillarida (Shriftning – 12. Qatorlar oralig‘i (interval) – 1) yozilishi lozim. So‘zlar soni 60-80 tani tashkil etishi maqsadga muvofiq bo‘ladi.
            </li>
            <li>
              Kalit so‘zlar – (6 – 10 tadan kam bo‘lmagan) uch tilda o‘zbek, rus, ingliz tillarida beriladi.
            </li>
            <li>
              Maqola mavzusiga mos UO‘T indeksi birinchi sahifaning chap burchagiga qo‘yiladi.
            </li>
            <li>
              Matndagi havolalar quyidagi tartibda shakllantiriladi; [1] yoki [2, S.170] yoki [3, S.132, 185, 193].
            </li>
            <li>
              Foydalanilgan adabiyotlar ro‘yxati alifbo tartibida (Times New Roman; 12 shrift; 1.0 interval) ko‘rsatilishi lozim.
            </li>
            <li>Tayyor maqolaning hajmi 5 betdan kam bo‘lmasligi lozim.</li>
            <li>
              Nashr uchun tayyor maqola 2 nusxada ekspert xulosasi va elektron varianti bilan qabul qilinadi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;