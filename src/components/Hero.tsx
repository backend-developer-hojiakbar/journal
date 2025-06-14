import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.2"
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-left md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">FARMATSIYA, IMMUNITET VA VAKSINA</span>
              <span className="block text-blue-400">jurnali</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Eng so'nggi ilmiy maqolalar, tadqiqotlar va kashfiyotlar bilan tanishing
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/current"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
              >
                Joriy nashr
              </a>
              <a
                href="/articles"
                className="px-8 py-3 border-2 border-blue-400 text-base font-medium rounded-md text-blue-100 hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105"
              >
                Maqolalarni ko'rish
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800"
              alt="Journal"
              className="rounded-lg shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300"
              style={{ maxWidth: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;