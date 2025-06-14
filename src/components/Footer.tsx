import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Jurnal haqida</h3>
            <p className="text-gray-300">
              Zamonaviy ilmiy jurnal - ilm-fan va tadqiqot natijalarini yorituvchi
              nufuzli nashr.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
            <p className="text-gray-300">
              Email: vak.immun@mail.ru<br />
              Tel: +998 90 124 81 33
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ijtimoiy tarmoqlar</h3>
            <div className="flex space-x-4">
              <a
                href="https://t.me/vaksinajurnali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© 2024 Ilmiy Jurnal. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;