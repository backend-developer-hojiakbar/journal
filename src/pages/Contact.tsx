import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe, Instagram, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Bog‘lanish</h1>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Xabar yuborish</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ismingiz
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Mavzu
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Xabar
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Yuborish
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Bog‘lanish ma’lumotlari</h2>
              <div className="space-y-5">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Manzil</h3>
                    <p className="text-gray-600">100004, Toshkent sh., Shayxontohur t., А.Navoiy k., 44-uy.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">E-mail</h3>
                    <p className="text-gray-600">qxjurnal@mail.ru</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Murojaat uchun telefonlar</h3>
                    <p className="text-gray-600">+998 71 242-13-54</p>
                    <p className="text-gray-600">+998 90 946-22-42</p>
                    <p className="text-gray-600">+998 93 500-54-99</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <Clock className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Ish vaqti</h3>
                    <p className="text-gray-600">Dushanba - Juma: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-4">Rasmiy sahifalarimiz</h2>
              <div className="space-y-3">
                 <a href="http://qxjurnal.uz" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-green-600">
                   <Globe className="h-5 w-5 mr-3"/> qxjurnal.uz
                 </a>
                 <a href="https://t.me/qxjurnal_uz" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-green-600">
                   <Send className="h-5 w-5 mr-3"/> qxjurnal_uz (Telegram)
                 </a>
                 <a href="https://www.facebook.com/profile.php?id=61573614329084" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-green-600">
                    <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"></path></svg>
                    qxjurnal (Facebook)
                 </a>
                 <a href="https://www.instagram.com/qxjurnal" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-green-600">
                   <Instagram className="h-5 w-5 mr-3"/> qxjurnal (Instagram)
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;