import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
            <p className="text-gray-300">
              Email: qxjurnal@mail.ru<br />
              Tel: +998 71 242-13-54<br/>
              Tel: +998 90 946-22-42
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Rasmiy sahifalarimiz</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="http://qxjurnal.uz/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Website</a>
              <a href="https://t.me/qxjurnal_uz" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Telegram</a>
              <a href="https://www.facebook.com/profile.php?id=61573614329084" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="https://www.instagram.com/qxjurnal" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© 2024 “O'zbekiston qishloq va suv xo‘jaligi” va “Agro ilm” jurnallari. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;