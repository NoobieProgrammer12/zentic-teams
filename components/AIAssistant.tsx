
import React, { useState, useRef, useEffect } from 'react';
import { User, Team } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface AIAssistantProps {
  team: Team;
  user: User;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ team, user }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `¡Hola ${user.name}! Soy el núcleo de inteligencia de Zentic. He analizado el entorno de "${team.name}" y estoy listo para optimizar vuestro rendimiento. ¿Qué desafío tenemos hoy?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const context = `Equipo: ${team.name}. Miembros: ${team.members.length}. Usuario: ${user.name}. Rol: ${user.role}. Tareas actuales del equipo: Activas.`;
    const aiResponse = await getGeminiResponse(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'He tenido una desconexión momentánea. ¿Puedes repetir?' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-slate-50/50 rounded-[2rem] shadow-2xl overflow-hidden border border-white">
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20">✨</div>
          <div>
            <h3 className="font-black tracking-tight">Zentic AI Pro</h3>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Gemini 3 Pro Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Sistema Activo</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-3xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-slate-900 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
                {msg.text}
              </p>
              <div className={`text-[9px] mt-2 opacity-40 font-bold uppercase ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? user.name : 'Zentic AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center gap-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procesando arquitectura de datos...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex gap-4 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-200 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pídeme analizar la productividad del equipo o crear un plan de trabajo..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-slate-900 text-white px-8 rounded-2xl font-black hover:bg-teal-600 transition-all disabled:opacity-30 disabled:hover:bg-slate-900 shadow-lg shadow-slate-900/10 active:scale-95 flex items-center gap-2"
          >
            <span>Consultar</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
