import React from 'react';

const newsImage = "/news/image.jpg"; 

const NewsSection = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Yangiliklar
          </h2>
          <div className="mt-2 w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/5">
            <img 
              src={newsImage} 
              alt="Yangiliklar"
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="md:w-3/5 text-gray-700 space-y-4">
            <p className="font-semibold text-lg text-red-600">
              🚨 Муаллифлар диққатига!
            </p>
            <p>
              “Агро илм” журналининг 4-сонига мақолалар қабули давом этаётганини ҳамда “Ўзбекистон қишлоқ ва сув хўжалиги” журналининг 8-сонига қабул бошланганини маълум қиламиз.
            </p>
            <p className="font-medium">
              Мақолалар IMRAD талаби бўйича қабул қилинади.
            </p>
            <div>
              <h4 className="font-semibold">Мурожаат учун телефонлар:</h4>
              <p>☎️ (71) 242-13-54</p>
              <p>☎️ (90) 946-22-42</p>
              <p>✉️ qxjurnal@mail.ru</p>
            </div>
            <div>
              <h4 className="font-semibold">Rasmiy sahifalarimiz:</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <a href="http://www.qxjurnal.uz/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a>
                <a href="https://t.me/qxjurnal_uz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram</a>
                <a href="https://www.facebook.com/profile.php?id=61573614329084" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;