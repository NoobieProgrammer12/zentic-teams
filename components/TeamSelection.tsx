
import React, { useState, useEffect } from 'react';
import { User, Team, JoinRequest } from '../types';

interface TeamSelectionProps {
  user: User;
  onTeamSelected: (team: Team) => void;
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ user, onTeamSelected }) => {
  const [view, setView] = useState<'options' | 'create' | 'join'>('options');
  const [search, setSearch] = useState('');
  const [newTeam, setNewTeam] = useState({ name: '', company: '', cover: '' });
  const [requestedId, setRequestedId] = useState<string | null>(null);

  const getTeams = (): Team[] => JSON.parse(localStorage.getItem('zentic_teams') || '[]');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.company) return;

    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      companyName: newTeam.company,
      coverImage: newTeam.cover || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
      ownerId: user.id,
      members: [{ ...user, role: 'Jefe' }],
      roles: ['Jefe', 'Manager', 'Miembro', 'Asistente'],
      pendingRequests: []
    };

    onTeamSelected(team);
  };

  const handleJoinRequest = (teamId: string) => {
    const teams = getTeams();
    const targetTeam = teams.find(t => t.id === teamId);
    if (!targetTeam) return;

    // Check if already requested
    if (targetTeam.pendingRequests.some(r => r.userId === user.id)) return;

    const request: JoinRequest = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now()
    };

    const updatedTeams = teams.map(t => 
      t.id === teamId ? { ...t, pendingRequests: [...t.pendingRequests, request] } : t
    );

    localStorage.setItem('zentic_teams', JSON.stringify(updatedTeams));
    setRequestedId(teamId);
  };

  const filteredTeams = getTeams().filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {view === 'options' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setView('create')}
              className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">🏢</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Crear Equipo</h3>
              <p className="text-slate-500 text-sm">Empieza tu propia empresa y gestiona tus colaboradores.</p>
            </button>

            <button 
              onClick={() => setView('join')}
              className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">🤝</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Unirse a uno</h3>
              <p className="text-slate-500 text-sm">Busca una empresa existente y solicita acceso.</p>
            </button>
          </div>
        )}

        {view === 'create' && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('options')} className="text-teal-600 font-bold mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">← Volver</button>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Configura tu Empresa</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre del Equipo</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Ej: Desarrollo Alpha" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Empresa</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Ej: Zentic Corp" value={newTeam.company} onChange={e => setNewTeam({...newTeam, company: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">URL Imagen de Portada (Opcional)</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="https://..." value={newTeam.cover} onChange={e => setNewTeam({...newTeam, cover: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">Lanzar Equipo</button>
            </form>
          </div>
        )}

        {view === 'join' && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 animate-in slide-in-from-left duration-300">
            <button onClick={() => setView('options')} className="text-teal-600 font-bold mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">← Volver</button>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Buscar Equipo</h2>
            <p className="text-slate-500 mb-6">Busca por nombre de equipo o empresa.</p>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border rounded-xl mb-8 outline-none focus:ring-2 focus:ring-teal-500" 
              placeholder="Escribe para buscar..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTeams.map(t => (
                <div key={t.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 hover:border-teal-300 transition-all group">
                  <div className="flex items-center gap-4">
                    <img src={t.coverImage} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{t.companyName}</p>
                    </div>
                  </div>
                  <button 
                    disabled={requestedId === t.id}
                    onClick={() => handleJoinRequest(t.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      requestedId === t.id 
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                      : 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-600 hover:text-white'
                    }`}
                  >
                    {requestedId === t.id ? 'Pendiente' : 'Unirse'}
                  </button>
                </div>
              ))}
              {filteredTeams.length === 0 && <p className="text-center text-slate-400 py-10">No se encontraron equipos.</p>}
            </div>
            {requestedId && (
              <p className="mt-6 text-xs text-center text-amber-600 font-bold p-3 bg-amber-50 rounded-xl">
                ⚠️ Solicitud enviada. El Jefe del equipo debe aceptarte para que puedas entrar.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSelection;
