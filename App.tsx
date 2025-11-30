import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { MentorDirectory } from './components/MentorDirectory';
import { SessionPage } from './components/SessionPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanel } from './components/AdminPanel';
import { ResourceLibrary } from './components/ResourceLibrary';
import { MessagingPage } from './components/MessagingPage';
import { Navigation } from './components/common/Navigation';
import { LandingPage } from './components/LandingPage';
import { apiService } from './services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'mentor' | 'mentee' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  goals?: string[];
  availability?: string[];
  rating?: number;
  totalSessions?: number;
  createdAt?: string;
}

export interface Session {
  id: string;
  mentorId: string;
  menteeId: string;
  title: string;
  description: string;
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [usersResponse, sessionsResponse, messagesResponse] = await Promise.all([
          apiService.getUsers(),
          apiService.getSessions(),
          apiService.getMessages()
        ]);

        setUsers(usersResponse.data);
        setSessions(sessionsResponse.data);
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to empty arrays if API fails
        setUsers([]);
        setSessions([]);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        totalSessions: 0,
        rating: 0
      };

      const response = await apiService.createUser(newUser);
      
      if (response.status === 201) {
        setUsers(prev => [...prev, response.data]);
        setCurrentUser(response.data);
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await apiService.updateUser(userId, userData);
      if (response.status === 200) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, ...response.data } : user
        ));
        
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(prev => prev ? { ...prev, ...response.data } : null);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const createSession = async (sessionData: Omit<Session, 'id'>) => {
    try {
      const newSession = {
        ...sessionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const response = await apiService.createSession(newSession);
      if (response.status === 201) {
        setSessions(prev => [...prev, response.data]);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const sendMessage = async (messageData: Omit<Message, 'id'>) => {
    try {
      const newMessage = {
        ...messageData,
        id: Date.now().toString()
      };

      const response = await apiService.sendMessage(newMessage);
      if (response.status === 201) {
        setMessages(prev => [...prev, response.data]);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  const renderPage = () => {
    if (loading && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return currentUser ? (
          <Dashboard 
            user={currentUser} 
            sessions={sessions} 
            messages={messages} 
            onNavigate={setCurrentPage} 
          />
        ) : null;
      case 'mentors':
        return currentUser ? (
          <MentorDirectory 
            users={users.filter(u => u.role === 'mentor')} 
            currentUser={currentUser} 
            onNavigate={setCurrentPage} 
          />
        ) : null;
      case 'sessions':
        return currentUser ? (
          <SessionPage 
            sessions={sessions.filter(s => s.mentorId === currentUser.id || s.menteeId === currentUser.id)} 
            currentUser={currentUser} 
            users={users} 
            onNavigate={setCurrentPage}
            onCreateSession={createSession}
          />
        ) : null;
      case 'profile':
        return currentUser ? (
          <ProfilePage 
            user={currentUser} 
            onNavigate={setCurrentPage}
            onUpdateUser={updateUser}
          />
        ) : null;
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <AdminPanel 
            users={users} 
            sessions={sessions} 
            onNavigate={setCurrentPage} 
          />
        ) : null;
      case 'resources':
        return currentUser ? <ResourceLibrary onNavigate={setCurrentPage} /> : null;
      case 'messages':
        return currentUser ? (
          <MessagingPage 
            messages={messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id)} 
            currentUser={currentUser} 
            users={users} 
            onNavigate={setCurrentPage}
            onSendMessage={sendMessage}
          />
        ) : null;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && <Navigation user={currentUser} onNavigate={setCurrentPage} onLogout={handleLogout} />}
      {renderPage()}
    </div>
  );
}

export default App;