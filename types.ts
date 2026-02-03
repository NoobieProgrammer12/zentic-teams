
export type UserRole = 'Jefe' | 'Manager' | 'Gerente' | 'Miembro' | 'Asistente';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  teamId?: string;
}

export interface JoinRequest {
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  companyName: string;
  coverImage: string;
  ownerId: string;
  members: User[];
  roles: string[];
  pendingRequests: JoinRequest[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isPrivate?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  createdBy: string;
}

export type View = 'Dashboard' | 'GroupChat' | 'Roles' | 'Agenda' | 'DirectMessages' | 'AIAssistant' | 'Tasks';
