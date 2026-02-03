
import React from 'react';
import { View, User } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  user: User;
  teamName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, teamName }) => {
  const menuItems = [
    { id: 'Dashboard', label: 'Principal', icon: '📊' },
    { id: 'Tasks', label: 'Trabajos', icon: '📋' },
    { id: 'GroupChat', label: 'Chat Grupal', icon: '💬' },
    { id: 'Roles', label: 'Roles', icon: '🛡️' },
    { id: 'Agenda', label: 'Agenda', icon: '📅' },
    { id: 'DirectMessages', label: 'Compañeros', icon: '👥' },
    { id: 'AIAssistant', label: 'Asistente Zentic', icon: '✨' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Zentic Teams
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{teamName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id 
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <img src={user.avatar} className="w-10 h-10 rounded-lg" alt="Profile" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
