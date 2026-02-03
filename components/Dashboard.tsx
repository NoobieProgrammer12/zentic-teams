
import React from 'react';
import { Team, User, JoinRequest } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  team: Team;
  user: User;
  onTeamUpdate: (team: Team) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ team, user, onTeamUpdate }) => {
  const isBoss = team.ownerId === user.id;

  const handleRequest = (req: JoinRequest, accept: boolean) => {
    const updatedRequests = team.pendingRequests.filter(r => r.userId !== req.userId);
    let updatedMembers = [...team.members];
    
    if (accept) {
      const newUser: User = {
        id: req.userId,
        name: req.userName,
        avatar: req.userAvatar,
        email: '', // Not stored in request for privacy
        role: 'Miembro'
      };
      updatedMembers.push(newUser);
    }

    onTeamUpdate({
      ...team,
      members: updatedMembers,
      pendingRequests: updatedRequests
    });
  };

  // Mock data for visualizations
  const efficiencyData = team.members.map((m, i) => ({
    name: m.name.split(' ')[0],
    tasks: 5 + (i * 2),
    efficiency: 70 + (i * 5)
  }));

  const taskDistribution = [
    { name: 'Completado', value: 45, color: '#10b981' },
    { name: 'En Proceso', value: 30, color: '#3b82f6' },
    { name: 'Pendiente', value: 25, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Portada del Equipo */}
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
        <img src={team.coverImage} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
          <div>
            <p className="text-teal-400 font-bold uppercase tracking-widest text-xs mb-1">{team.companyName}</p>
            <h1 className="text-4xl font-black text-white">{team.name}</h1>
          </div>
        </div>
      </div>

      {/* Gestión de Solicitudes (Solo para el Jefe) */}
      {isBoss && team.pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
          <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-4">
            <span className="animate-pulse">🔔</span> Solicitudes Pendientes ({team.pendingRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.pendingRequests.map(req => (
              <div key={req.userId} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={req.userAvatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-800">{req.userName}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Solicitud: {new Date(req.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRequest(req, true)} className="p-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700">Aceptar</button>
                  <button onClick={() => handleRequest(req, false)} className="p-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200">Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Eficiencia Global</p>
          <p className="text-4xl font-black text-teal-600 mt-2">88.2%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Miembros Activos</p>
          <p className="text-4xl font-black text-blue-600 mt-2">{team.members.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Pendientes Críticos</p>
          <p className="text-4xl font-black text-amber-500 mt-2">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Productividad del Equipo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="efficiency" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Estado del Trabajo</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {taskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
