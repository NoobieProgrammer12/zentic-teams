
import React, { useState, useRef, useEffect } from 'react';
import { User, Team } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface AIAssistantProps {
  team: Team;
  user: User;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ team, user }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: `¡Hola ${user.name}! Soy tu Asistente Zentic. ¿En qué puedo ayudarte a mejorar la productividad de tu equipo hoy?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const context = `El equipo se llama ${team.name}, tiene ${team.members.length} miembros. El usuario actual es ${user.name} con el rol de ${user.role}.`;
    const aiResponse = await getGeminiResponse(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'No he podido responder.' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-4 bg-teal-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">✨</div>
        <div>
          <h3 className="font-bold">Asistente Zentic IA</h3>
          <p className="text-xs text-teal-100">Inteligencia Artificial para potenciar tu trabajo</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-teal-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl animate-pulse flex gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu duda o pide ayuda con tus tareas..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all disabled:opacity-50"
          >
            Preguntar
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Asistente Zentic utiliza Gemini 3 Flash para ofrecerte el mejor apoyo laboral.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
