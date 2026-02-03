
import React, { useState, useEffect, useRef } from 'react';
import { Team, User, ChatMessage } from '../types';
import { db } from '../services/supabase';

interface GroupChatProps {
  team: Team;
  user: User;
}

const GroupChat: React.FC<GroupChatProps> = ({ team, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes iniciales
  useEffect(() => {
    const load = async () => {
      const msgs = await db.getMessages(team.id);
      setMessages(msgs);
    };
    load();

    // Simulación de "Realtime" escuchando cambios en la DB
    const handleNewMsg = (e: any) => {
      if (e.detail.teamId === team.id) {
        setMessages(prev => {
          // Evitar duplicados si el mensaje es nuestro
          if (prev.some(m => m.id === e.detail.msg.id)) return prev;
          return [...prev, e.detail.msg];
        });
      }
    };

    window.addEventListener('zentic_new_message', handleNewMsg);
    return () => window.removeEventListener('zentic_new_message', handleNewMsg);
  }, [team.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    
    const newMsg: ChatMessage = { 
      id: Math.random().toString(36).substr(2, 9), 
      senderId: user.id, 
      text: input, 
      timestamp: new Date() 
    };

    await db.saveMessage(newMsg, team.id);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <h4 className="font-bold text-slate-700 text-sm">Canal General de {team.name}</h4>
        </div>
        <p className="text-xs text-slate-400">{messages.length} mensajes compartidos</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        {messages.map((msg) => {
          const sender = team.members.find(m => m.id === msg.senderId);
          const isMe = msg.senderId === user.id;

          return (
            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
              <img src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} className="w-10 h-10 rounded-full bg-slate-200" />
              <div className={`max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-tight">{sender?.name || 'Usuario desconocido'}</span>
                  <span className="text-[10px] text-slate-300">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={`p-4 shadow-sm ${
                  isMe 
                  ? 'bg-slate-900 text-white rounded-2xl rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <span className="text-4xl mb-2">👋</span>
            <p className="text-sm font-medium">¡Sé el primero en saludar al equipo!</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-teal-400 transition-all">
          <input 
            type="text" 
            placeholder="Escribe un mensaje al equipo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && send()}
            className="flex-1 px-4 py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button 
            onClick={send}
            className="bg-slate-900 text-white p-2 px-6 rounded-xl font-bold hover:bg-teal-600 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Enviar</span>
            <span className="text-xs opacity-50">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
