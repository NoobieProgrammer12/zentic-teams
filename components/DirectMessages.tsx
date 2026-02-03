
import React, { useState } from 'react';
import { Team, User } from '../types';

interface DirectMessagesProps {
  team: Team;
  user: User;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({ team, user }) => {
  const colleagues = team.members.filter(m => m.id !== user.id);
  const [selected, setSelected] = useState<User | null>(colleagues[0] || null);
  const [msg, setMsg] = useState('');

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* List */}
      <div className="w-80 border-r bg-slate-50/50">
        <div className="p-4 border-b bg-white">
          <input type="text" placeholder="Buscar compañeros..." className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none" />
        </div>
        <div className="overflow-y-auto">
          {colleagues.map(col => (
            <div 
              key={col.id} 
              onClick={() => setSelected(col)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition-colors border-b border-slate-100 ${
                selected?.id === col.id ? 'bg-white border-l-4 border-l-teal-500' : ''
              }`}
            >
              <img src={col.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              <div className="overflow-hidden">
                <p className="font-bold text-slate-800 truncate">{col.name}</p>
                <p className="text-xs text-slate-400 truncate">{col.role} • En línea</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selected ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selected.avatar} className="w-8 h-8 rounded-full" />
                <h3 className="font-bold text-slate-800">{selected.name}</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600">Ver Perfil</button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-end space-y-4">
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none max-w-[70%] text-sm">
                  Hola {user.name}, ¿cómo va el progreso de la tarea asignada hoy?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-teal-600 text-white p-3 rounded-xl rounded-tr-none max-w-[70%] text-sm shadow-md shadow-teal-600/10">
                  ¡Hola {selected.name}! Casi terminado, subo el reporte en 20 minutos.
                </div>
              </div>
              <div className="text-center text-[10px] text-slate-300 my-4 uppercase tracking-tighter">Hoy, 12:45 PM</div>
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder={`Mensaje privado para ${selected.name.split(' ')[0]}...`}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <button className="p-3 bg-teal-600 text-white rounded-xl">
                  <span className="rotate-45 block">🚀</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <span className="text-6xl mb-4">💬</span>
            <p>Selecciona un compañero para chatear en privado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;
