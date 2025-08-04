import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { token, logout } = useAuth();

  const menuItems = [
    { title: "Bosh sahifa", href: "/" },
    { title: "Jurnal haqida", href: "/about" },
    { title: "Joriy nashr (QX)", href: "/current/qx" },
    { title: "Joriy nashr (AI)", href: "/current/ai" },
    { title: "Arxiv", href: "/archive" },
    { title: "Bog'lanish", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/current')) {
      return location.pathname.startsWith('/current');
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Qishloq Xo'jaligi</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link key={item.title} to={item.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'}`}>
                {item.title}
              </Link>
            ))}
            {token ? (
              <>
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-green-700 hover:bg-green-50">Admin Panel</Link>
                <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">Chiqish</button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">Kirish</Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link key={item.title} to={item.href} onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'}`}>
                {item.title}
              </Link>
            ))}
             {token ? (
              <>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-50">Admin Panel</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50">Chiqish</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">Kirish</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;