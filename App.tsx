
import React, { useState, useEffect } from 'react';
import { User, Team, View } from './types';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';
import TeamSelection from './components/TeamSelection';
import Dashboard from './components/Dashboard';
import GroupChat from './components/GroupChat';
import RolesManager from './components/RolesManager';
import Agenda from './components/Agenda';
import DirectMessages from './components/DirectMessages';
import AIAssistant from './components/AIAssistant';
import TasksBoard from './components/TasksBoard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [currentView, setCurrentView] = useState<View>('Dashboard');

  // Persistence management
  useEffect(() => {
    const savedUser = localStorage.getItem('zentic_current_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Look for the team this user belongs to
      const teams: Team[] = JSON.parse(localStorage.getItem('zentic_teams') || '[]');
      const userTeam = teams.find(t => t.members.some(m => m.id === parsedUser.id));
      if (userTeam) setTeam(userTeam);
    }
  }, []);

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem('zentic_current_user', JSON.stringify(userData));
    
    // Check if team exists for this user
    const teams: Team[] = JSON.parse(localStorage.getItem('zentic_teams') || '[]');
    const userTeam = teams.find(t => t.members.some(m => m.id === userData.id));
    if (userTeam) setTeam(userTeam);
  };

  const handleLogout = () => {
    setUser(null);
    setTeam(null);
    localStorage.removeItem('zentic_current_user');
  };

  const handleTeamUpdate = (updatedTeam: Team) => {
    setTeam(updatedTeam);
    const teams: Team[] = JSON.parse(localStorage.getItem('zentic_teams') || '[]');
    const newTeams = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    localStorage.setItem('zentic_teams', JSON.stringify(newTeams));
  };

  const handleTeamCreated = (newTeam: Team) => {
    setTeam(newTeam);
    const teams: Team[] = JSON.parse(localStorage.getItem('zentic_teams') || '[]');
    localStorage.setItem('zentic_teams', JSON.stringify([...teams, newTeam]));
  };

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (!team) {
    return <TeamSelection user={user} onTeamSelected={handleTeamCreated} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard': return <Dashboard team={team} user={user} onTeamUpdate={handleTeamUpdate} />;
      case 'GroupChat': return <GroupChat team={team} user={user} />;
      case 'Roles': return <RolesManager team={team} user={user} setTeam={handleTeamUpdate} />;
      case 'Agenda': return <Agenda team={team} user={user} />;
      case 'DirectMessages': return <DirectMessages team={team} user={user} />;
      case 'AIAssistant': return <AIAssistant team={team} user={user} />;
      case 'Tasks': return <TasksBoard team={team} user={user} />;
      default: return <Dashboard team={team} user={user} onTeamUpdate={handleTeamUpdate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user} 
        teamName={team.name}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {currentView === 'Dashboard' ? 'Panel Principal' : 
             currentView === 'GroupChat' ? 'Chat de Equipo' :
             currentView === 'Roles' ? 'Gestión de Roles' :
             currentView === 'Agenda' ? 'Agenda del Equipo' :
             currentView === 'DirectMessages' ? 'Compañeros' :
             currentView === 'AIAssistant' ? 'Asistente Zentic' : 'Asignación de Trabajos'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">{user.name} ({user.role})</span>
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
            <button 
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>
        <div className="p-8 flex-1">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
