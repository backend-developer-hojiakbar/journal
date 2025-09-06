import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const navItems = [
    { name: "Xabarlar", path: "/admin/messages" },
    { name: "Yangiliklar", path: "/admin/news" },
    // { name: "Jurnallar", path: "/admin/journals" }, // Hidden from admin
    { name: "Nashrlar", path: "/admin/issues" },
    { name: "Maqolalar", path: "/admin/articles" },
    // { name: "Mualliflar", path: "/admin/authors" }, // Integrated into article management
    // { name: "Kalit so'zlar", path: "/admin/keywords" }, // Integrated into article management
    { name: "Tahririyat", path: "/admin/board" },
  ];

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Boshqaruv</h2>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `block py-2.5 px-4 rounded-md text-sm hover:bg-gray-700 transition-colors ${isActive ? 'bg-blue-600' : ''}`}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;