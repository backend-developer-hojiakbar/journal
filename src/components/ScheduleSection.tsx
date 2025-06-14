import React from 'react';

const ScheduleSection = () => {
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
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha va Tavsif */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Ilmiy-amaliy jurnal
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
          Ta`sischi: Toshkent vaksina va zardoblar ilmiy-tadqiqot instituti
          </p>
          <p className="mt-3 text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
          “FARMATSIYA, IMMUNITET VA VAKSINA” ilmiy-amaliy jurnali O‘zbekiston Respublikasi Oliy Attestatsiya Komissiyasi tomonidan
          resenziyalanadigan ilmiy jurnallar (nashrlar) ro‘yxatiga kiritilgan.
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
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900">So'nggi nashrlar:</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {archives.map((archive, index) => (
              <a
                key={index}
                href="#"
                className="px-6 py-3 border border-green-600 rounded-md text-base font-medium text-green-700 hover:bg-green-50 transition-all"
              >
                {archive}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;