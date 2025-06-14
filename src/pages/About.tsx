import React from 'react';

const About = () => {
  const schedules = [
    { time: "02.00.00", subject: "Kimyo fanlari" },
    { time: "03.00.00", subject: "Biologiya fanlari" },
    { time: "14.00.00", subject: "Tibbiyot fanlari" },
    { time: "15.00.00", subject: "Farmatsevtika fanlari" },
  ];

  const archives = [
    "2024 – №4",
    "2024 – №3",
    "2024 – №2",
    "2024 – №1",
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ilmiy-amaliy jurnal qismi (ScheduleSection dan olingan) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ilmiy-amaliy jurnal
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
            Ta'sischilar: Toshkent vaksina va zardoblar ilmiy-tadqiqot instituti
          </p>
          <p className="mt-3 text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
            “Farmatsiya, Immunitet va Vaktsina” ilmiy-amaliy jurnali O‘zbekiston Respublikasi Oliy Attestatsiya Komissiyasi tomonidan
            resenzialanadigan ilmiy jurnallar ro‘yxatiga kiritilgan.
          </p>
        </div>

        {/* Jadval qismi */}
        <div className="mt-12">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } ${index !== schedules.length - 1 ? "border-b border-gray-300" : ""}`}
              >
                <span className="text-lg font-medium text-gray-900">
                  {schedule.time}
                </span>
                <span className="text-lg text-gray-900">{schedule.subject}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arxiv qismi */}
        

        {/* Tahririyat a'zolari */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center">TAHRIRIYAT</h2>
          <h3 className="text-xl font-bold text-gray-800 text-center mt-6">BOSH MUHARIR</h3>
          <div className="border border-gray-300 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <img
                src="https://via.placeholder.com/80" // Default odam rasmi
                alt="Bosh muharrir"
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <p className="text-gray-600 font-medium">FIO: Menglikulov Erkin Eshdavlatovich</p>
                <p className="text-gray-500 text-sm">Ish joyi: Davlat ilmiy-loyihalashtirish instituti “Uzdavjerloixa”</p>
                <p className="text-gray-500 text-sm">Lavozimi: Bosh muharrir</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 text-center mt-6">HAY’AT A’ZOLARI</h3>
          <div className="space-y-6 mt-4">
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://via.placeholder.com/80" // Default odam rasmi
                  alt="Hay'at a'zosi"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-600 font-medium">FIO: Abduraxmonov Ibrohim Yulchiyevich</p>
                  <p className="text-gray-500 text-sm">Ilmiy darajasi va unvoni: Doktor biologik fanlar, Akademik</p>
                  <p className="text-gray-500 text-sm">Ish joyi: O‘zbekiston Respublikasi Qishloq xo‘jaligi vazirligi</p>
                  <p className="text-gray-500 text-sm">Lavozimi: Muharrir</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://via.placeholder.com/80" // Default odam rasmi
                  alt="Hay'at a'zosi"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-600 font-medium">FIO: Norboyev Bahrom To‘rayevich</p>
                  <p className="text-gray-500 text-sm">Ilmiy darajasi va unvoni: Doktor falsafa va biologik fanlar (PhD)</p>
                  <p className="text-gray-500 text-sm">Ish joyi: O‘zbekiston Respublikasi Hayvonchilik rivojlantirish davlat qo‘mitasi</p>
                  <p className="text-gray-500 text-sm">Lavozimi: Prezidenti Komitet</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://via.placeholder.com/80" // Default odam rasmi
                  alt="Hay'at a'zosi"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-600 font-medium">FIO: Abdullayev Abdushukur Xamidxonovich</p>
                  <p className="text-gray-500 text-sm">Ilmiy darajasi va unvoni: Doktor texnik fanlar, dotsent</p>
                  <p className="text-gray-500 text-sm">Ish joyi: Direktor o‘rinbosari</p>
                  <p className="text-gray-500 text-sm">Lavozimi: Direktor o‘rinbosari</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://via.placeholder.com/80" // Default odam rasmi
                  alt="Hay'at a'zosi"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-600 font-medium">FIO: Turayev Ruhiddin Amirqulovich</p>
                  <p className="text-gray-500 text-sm">Ilmiy darajasi va unvoni: Doktor texnik fanlar, professor</p>
                  <p className="text-gray-500 text-sm">Ish joyi: Davlat ilmiy-loyihalashtirish instituti “Uzdavjerloixa”</p>
                  <p className="text-gray-500 text-sm">Lavozimi: Professor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maqolalar uchun talablar */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Maqolalar uchun talablar</h2>
          <p className="text-gray-600 mb-4">
            “O‘zbekiston zamini” ilmiy-amaliy va innovatsion jurnalida maqola chop etish uchun qo‘yiladigan
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