
import React, { useState } from 'react';
import { Team, User, CalendarEvent } from '../types';

interface AgendaProps {
  team: Team;
  user: User;
}

const Agenda: React.FC<AgendaProps> = ({ team, user }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 'e1', title: 'Planificación Q1 2026', startTime: '10:00', endTime: '11:00', description: 'Metas anuales', createdBy: 'user-1' },
    { id: 'e2', title: 'Lanzamiento Zentic v2', startTime: '15:30', endTime: '16:30', description: 'Revisión final', createdBy: 'user-2' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '2026-01-01',
    startTime: '09:00',
    endTime: '10:00',
    description: ''
  });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const getCalendarData = (month: number) => {
    const date = new Date(2026, month, 1);
    let startDay = date.getDay() - 1;
    if (startDay === -1) startDay = 6;
    const daysInMonth = new Date(2026, month + 1, 0).getDate();
    return { startDay, daysInMonth };
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: `${formData.description} (Fecha: ${formData.date})`,
      createdBy: user.id
    };
    setEvents([newEvent, ...events]);
    setIsModalOpen(false);
    setFormData({ title: '', date: '2026-01-01', startTime: '09:00', endTime: '10:00', description: '' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden relative">
      {/* Modal para Agendar Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Agendar Nuevo Evento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Evento</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Ej: Reunión de Sincronización"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción corta</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                    placeholder="Opcional"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora Inicio</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hora Fin</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2026 Full Calendar Scrollable Area */}
      <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-2">
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">Calendario 2026</h3>
            <p className="text-slate-500">Planificación anual de Zentic Teams</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold uppercase tracking-widest">Año Completo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {monthNames.map((monthName, monthIdx) => {
            const { startDay, daysInMonth } = getCalendarData(monthIdx);
            const blanks = Array(startDay).fill(null);
            const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            return (
              <div key={monthName} className="border border-slate-50 p-4 rounded-xl hover:shadow-md transition-shadow bg-slate-50/30">
                <h4 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{monthName}</h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysOfWeek.map(d => (
                    <div key={d} className="text-[10px] font-bold text-slate-400 uppercase mb-2">{d}</div>
                  ))}
                  {blanks.map((_, i) => (
                    <div key={`blank-${i}`} className="h-8"></div>
                  ))}
                  {dayArray.map(day => {
                    const hasEvent = (monthIdx === 0 && day === 15) || (monthIdx === 5 && day === 10);
                    return (
                      <div 
                        key={day} 
                        className={`h-8 flex flex-col items-center justify-center rounded-lg text-xs font-medium cursor-pointer transition-colors relative
                          ${hasEvent ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-white hover:shadow-sm'}
                        `}
                      >
                        {day}
                        {hasEvent && <span className="absolute bottom-1 w-1 h-1 bg-teal-500 rounded-full"></span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar for Events and Actions */}
      <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span>📅</span> Hitos de 2026
            </h4>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {events.map(event => (
              <div key={event.id} className="group relative p-4 border-l-4 border-teal-500 bg-slate-50 rounded-r-xl hover:bg-teal-50 transition-colors cursor-pointer">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{event.startTime} - {event.endTime}</p>
                <p className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{event.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
              </div>
            ))}
            {events.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No hay eventos agendados</p>}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <span>+</span> Agendar Evento
          </button>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-teal-500/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💡</span>
            <p className="text-xs font-bold opacity-90 uppercase tracking-wider">Productividad 2026</p>
          </div>
          <p className="text-sm font-medium leading-relaxed">
            Has organizado el año completo. Recuerda dejar espacios de descanso entre grandes hitos para mantener la eficiencia del equipo alta.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Resumen del Año</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Días Laborales</span>
              <span className="font-bold text-slate-700">261</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Eventos Totales</span>
              <span className="font-bold text-slate-700">{events.length}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-teal-500 h-full w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
