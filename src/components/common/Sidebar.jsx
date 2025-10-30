import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar({ items, currentRole }) {
  const filteredItems = items.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-gray-200 min-h-screen fixed left-0 top-0 z-30">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-hospital-purple">HMS</h1>
        <p className="text-sm text-gray-600 mt-1">Hospital Management</p>
      </div>
      <nav className="px-3 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-hospital-purple text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
