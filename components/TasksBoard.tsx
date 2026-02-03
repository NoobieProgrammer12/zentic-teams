
import React, { useState } from 'react';
import { Team, User, Task } from '../types';

interface TasksBoardProps {
  team: Team;
  user: User;
}

const TasksBoard: React.FC<TasksBoardProps> = ({ team, user }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Diseñar Logo Zentic', description: 'Crear versión final en vector', assignedTo: 'user-2', deadline: '2024-05-20', status: 'Completed', priority: 'High' },
    { id: 't2', title: 'Reunión de Feedback', description: 'Analizar métricas Q1', assignedTo: 'user-1', deadline: '2024-05-22', status: 'In Progress', priority: 'Medium' },
    { id: 't3', title: 'Configurar Servidor', description: 'Instalar certificados SSL', assignedTo: 'user-2', deadline: '2024-05-25', status: 'Pending', priority: 'High' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignedTo: team.members[0].id, deadline: '', priority: 'Medium' as 'Low' | 'Medium' | 'High' });

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: 'Sin descripción adicional',
      assignedTo: newTask.assignedTo,
      deadline: newTask.deadline || '2024-12-31',
      status: 'Pending',
      priority: newTask.priority,
    };
    setTasks([...tasks, task]);
    setIsAdding(false);
    setNewTask({ title: '', assignedTo: team.members[0].id, deadline: '', priority: 'Medium' });
  };

  const isBoss = user.role === 'Jefe' || user.role === 'Manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Trabajos del Equipo</h3>
          <p className="text-slate-500 text-sm">Organiza y supervisa el flujo de trabajo</p>
        </div>
        {isBoss && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center gap-2"
          >
            <span>+</span> Asignar Trabajo
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border-2 border-teal-100 shadow-xl animate-in slide-in-from-top duration-300">
          <h4 className="font-bold text-slate-800 mb-4">Nueva Tarea</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="px-4 py-2 border rounded-lg" 
              placeholder="¿Qué hay que hacer?"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            <select 
              className="px-4 py-2 border rounded-lg"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
            >
              {team.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input 
              type="date" 
              className="px-4 py-2 border rounded-lg"
              value={newTask.deadline}
              onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            />
            <div className="flex gap-2">
              <button onClick={handleAddTask} className="flex-1 bg-teal-600 text-white rounded-lg">Crear</button>
              <button onClick={() => setIsAdding(false)} className="px-4 border rounded-lg text-slate-400">X</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Tarea</th>
              <th className="px-6 py-4">Responsable</th>
              <th className="px-6 py-4">Fecha Límite</th>
              <th className="px-6 py-4">Prioridad</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map(task => {
              const assignedUser = team.members.find(m => m.id === task.assignedTo);
              return (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.description}</p>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <img src={assignedUser?.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-slate-700">{assignedUser?.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{task.deadline}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      task.priority === 'High' ? 'bg-red-100 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksBoard;
