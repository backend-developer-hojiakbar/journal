import React from 'react';
import { Link } from 'react-router-dom';

const journalCover1 = "/covers/qxj.jpg"; 
const journalCover2 = "/covers/agro-ilm.jpg"; 

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-900 to-teal-900">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.2"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">“O'zbekiston qishloq va suv xo‘jaligi”</span>
              <span className="block text-green-300 mt-2">& “Agro ilm” jurnallari</span>
            </h1>
            <p className="mt-4 text-base text-gray-200 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl">
              Agrar-iqtisodiy, ilmiy-ommabop va ilmiy-amaliy nashrlar
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/current/qx"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
              >
                Qishloq xo'jaligi
              </Link>
              <Link
                to="/current/ai"
                className="px-8 py-3 border-2 border-green-400 text-base font-medium rounded-md text-green-100 hover:bg-green-800 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
              >
                Agro Ilm
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center items-center gap-4">
            <img
              src={journalCover1}
              alt="O'zbekiston qishloq va suv xo'jaligi jurnali"
              className="rounded-lg shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300 w-1/2 max-w-[200px]"
            />
            <img
              src={journalCover2}
              alt="Agro ilm jurnali"
              className="rounded-lg shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-transform duration-300 w-1/2 max-w-[200px] mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;