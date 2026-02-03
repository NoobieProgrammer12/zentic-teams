
import React, { useState } from 'react';
import { Team, User } from '../types';

interface RolesManagerProps {
  team: Team;
  user: User;
  setTeam: (team: Team) => void;
}

const RolesManager: React.FC<RolesManagerProps> = ({ team, user, setTeam }) => {
  const [newRole, setNewRole] = useState('');
  const isBoss = user.role === 'Jefe';

  const addRole = () => {
    if (!newRole || team.roles.includes(newRole)) return;
    setTeam({
      ...team,
      roles: [...team.roles, newRole]
    });
    setNewRole('');
  };

  const removeRole = (role: string) => {
    if (['Jefe', 'Miembro'].includes(role)) return; // Protection
    setTeam({
      ...team,
      roles: team.roles.filter(r => r !== role)
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Estructura Jerárquica</h3>
        <p className="text-slate-500 text-sm mb-6">
          Define los roles y permisos del equipo. Solo el Jefe puede crear nuevos niveles.
        </p>

        {isBoss && (
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Ej: Gerente de Ventas"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            <button 
              onClick={addRole}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800"
            >
              Crear Rol
            </button>
          </div>
        )}

        <div className="space-y-3">
          {team.roles.map(role => (
            <div key={role} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-teal-100 text-teal-600 flex items-center justify-center rounded-lg font-bold">
                  {role[0]}
                </div>
                <span className="font-semibold text-slate-700">{role}</span>
              </div>
              {isBoss && !['Jefe', 'Miembro'].includes(role) && (
                <button 
                  onClick={() => removeRole(role)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Usuarios y Roles Actuales</h3>
        <div className="divide-y divide-slate-100">
          {team.members.map(member => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <img src={member.avatar} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                member.role === 'Jefe' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesManager;
