
// Este archivo prepara la conexión con Supabase. 
// Para producción en Vercel, añade SUPABASE_URL y SUPABASE_KEY en variables de entorno.

import { User, Team, ChatMessage, JoinRequest, Task } from '../types';

// Simulador de persistencia en la nube (sustituible por cliente real de Supabase)
export const db = {
  // USUARIOS
  async checkNameUnique(name: string): Promise<boolean> {
    const users: User[] = JSON.parse(localStorage.getItem('zentic_users') || '[]');
    return !users.some(u => u.name.toLowerCase() === name.toLowerCase());
  },

  async registerUser(user: User): Promise<void> {
    const users = JSON.parse(localStorage.getItem('zentic_users') || '[]');
    localStorage.setItem('zentic_users', JSON.stringify([...users, user]));
  },

  async loginUser(email: string, pass: string): Promise<User | null> {
    const users: User[] = JSON.parse(localStorage.getItem('zentic_users') || '[]');
    return users.find(u => u.email === email && u.password === pass) || null;
  },

  // EQUIPOS
  async createTeam(team: Team): Promise<void> {
    const teams = JSON.parse(localStorage.getItem('zentic_teams') || '[]');
    localStorage.setItem('zentic_teams', JSON.stringify([...teams, team]));
  },

  async getAllTeams(): Promise<Team[]> {
    return JSON.parse(localStorage.getItem('zentic_teams') || '[]');
  },

  async updateTeam(updatedTeam: Team): Promise<void> {
    const teams = await this.getAllTeams();
    const newTeams = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    localStorage.setItem('zentic_teams', JSON.stringify(newTeams));
  },

  // MENSAJES (Aquí es donde entraría Supabase Realtime)
  async saveMessage(msg: ChatMessage, teamId: string): Promise<void> {
    const key = `zentic_messages_${teamId}`;
    const msgs = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...msgs, msg]));
    
    // Disparar evento personalizado para simular "Realtime" en la misma pestaña/ventana
    window.dispatchEvent(new CustomEvent('zentic_new_message', { detail: { teamId, msg } }));
  },

  async getMessages(teamId: string): Promise<ChatMessage[]> {
    const key = `zentic_messages_${teamId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
};
