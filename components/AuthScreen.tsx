
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/supabase';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const found = await db.loginUser(email, password);
        if (found) {
          onAuth(found);
        } else {
          setError('Credenciales incorrectas o cuenta inexistente.');
        }
      } else {
        const isUnique = await db.checkNameUnique(name);
        if (!isUnique) {
          setError('Este nombre ya está en uso por otro compañero.');
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password,
          role: 'Miembro',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        await db.registerUser(newUser);
        onAuth(newUser);
      }
    } catch (err) {
      setError('Error de conexión con la nube Zentic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent mb-2">Zentic Teams</h1>
          <p className="text-slate-400 text-sm font-medium">Tu oficina inteligente, estés donde estés.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg animate-in fade-in slide-in-from-top-1">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de Usuario Único</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                placeholder="Ej: Alejandro_Z"
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Corporativo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
              placeholder="nombre@empresa.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Entrar a Zentic' : 'Crear mi oficina')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 font-medium">
            {isLogin ? '¿Primera vez en Zentic Teams?' : '¿Ya tienes un equipo?'}
          </p>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-teal-600 font-black text-sm hover:underline underline-offset-4"
          >
            {isLogin ? 'Empieza gratis hoy' : 'Inicia sesión aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
