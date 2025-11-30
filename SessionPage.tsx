import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Star,
  MessageSquare,
  Video,
  FileText,
  Plus
} from 'lucide-react';
import type { Session, User as UserType } from '../App';

interface SessionPageProps {
  sessions: Session[];
  currentUser: UserType;
  users: UserType[];
  onNavigate: (page: string) => void;
  onCreateSession: (sessionData: Omit<Session, 'id'>) => Promise<Session | null>;
}

export function SessionPage({ sessions, currentUser, users, onNavigate, onCreateSession }: SessionPageProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    mentorId: '',
    title: '',
    description: '',
    dateTime: '',
    duration: 60
  });

  const getOtherUser = (session: Session) => {
    const otherId = session.mentorId === currentUser.id ? session.menteeId : session.mentorId;
    return users.find(u => u.id === otherId);
  };

  const filteredSessions = sessions.filter(session => {
    const now = new Date();
    const sessionDate = new Date(session.dateTime);
    
    switch (activeTab) {
      case 'upcoming':
        return session.status === 'scheduled' && sessionDate > now;
      case 'completed':
        return session.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: sessions.filter(s => s.status === 'scheduled' && new Date(s.dateTime) > new Date()).length },
    { key: 'completed', label: 'Completed', count: sessions.filter(s => s.status === 'completed').length },
    { key: 'all', label: 'All Sessions', count: sessions.length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSession = async () => {
    if (!newSessionForm.mentorId || !newSessionForm.title || !newSessionForm.dateTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const sessionData = {
        mentorId: newSessionForm.mentorId,
        menteeId: currentUser.id,
        title: newSessionForm.title,
        description: newSessionForm.description,
        dateTime: newSessionForm.dateTime,
        duration: newSessionForm.duration,
        status: 'scheduled' as const
      };

      const newSession = await onCreateSession(sessionData);
      if (newSession) {
        setShowNewSessionModal(false);
        setNewSessionForm({
          mentorId: '',
          title: '',
          description: '',
          dateTime: '',
          duration: 60
        });
        alert('Session scheduled successfully!');
      } else {
        alert('Failed to create session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const availableMentors = users.filter(user => 
    user.role === 'mentor' && user.id !== currentUser.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">Manage your mentoring sessions and track your progress</p>
        </div>
        {currentUser.role === 'mentee' && (
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Session
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const otherUser = getOtherUser(session);
            const sessionDate = new Date(session.dateTime);
            
            return (
              <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">{session.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>
                            {currentUser.role === 'mentor' ? 'Mentee: ' : 'Mentor: '}{otherUser?.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{sessionDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{sessionDate.toLocaleTimeString()} ({session.duration} mins)</span>
                        </div>
                      </div>
                      
                      {session.description && (
                        <div>
                          <p className="text-sm text-gray-600">{session.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Rating and Feedback */}
                    {session.status === 'completed' && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        {session.rating && (
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{session.rating}/5</span>
                          </div>
                        )}
                        {session.feedback && (
                          <p className="text-sm text-gray-600 italic">"{session.feedback}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    {session.status === 'scheduled' && (
                      <>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center text-sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </button>
                        <button 
                          onClick={() => onNavigate('messages')}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium flex items-center text-sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </button>
                      </>
                    )}
                    {session.status === 'completed' && !session.rating && (
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-medium flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2" />
                        Rate Session
                      </button>
                    )}
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Notes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming sessions scheduled."
              : activeTab === 'completed'
              ? "No completed sessions yet."
              : "No sessions found."
            }
          </p>
          {currentUser.role === 'mentee' && (
            <button
              onClick={() => onNavigate('mentors')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Find Mentors
            </button>
          )}
        </div>
      )}

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Session</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Mentor *
                </label>
                <select
                  value={newSessionForm.mentorId}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, mentorId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a mentor</option>
                  {availableMentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.experience}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={newSessionForm.title}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., React Best Practices Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSessionForm.description}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={newSessionForm.dateTime}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, dateTime: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={newSessionForm.duration}
                  onChange={(e) => setNewSessionForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Scheduling...' : 'Schedule Session'}
              </button>
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}