import React from 'react';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Star,
  Target,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import type { User, Session, Message } from '../App';

interface DashboardProps {
  user: User;
  sessions: Session[];
  messages: Message[];
  onNavigate: (page: string) => void;
}

export function Dashboard({ user, sessions, messages, onNavigate }: DashboardProps) {
  const upcomingSessions = sessions.filter(s => 
    s.status === 'scheduled' && new Date(s.dateTime) > new Date()
  );
  const unreadMessages = messages.filter(m => !m.read && m.receiverId === user.id);

  const stats = [
    {
      title: 'Upcoming Sessions',
      value: upcomingSessions.length,
      icon: Calendar,
      color: 'bg-blue-500',
      action: () => onNavigate('sessions')
    },
    {
      title: 'Unread Messages',
      value: unreadMessages.length,
      icon: MessageSquare,
      color: 'bg-green-500',
      action: () => onNavigate('messages')
    },
    {
      title: 'Total Sessions',
      value: user.totalSessions || sessions.filter(s => 
        (s.mentorId === user.id || s.menteeId === user.id) && s.status === 'completed'
      ).length,
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Rating',
      value: user.rating ? `${user.rating}/5` : 'N/A',
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = user.role === 'mentee' 
    ? [
        { title: 'Find a Mentor', description: 'Browse available mentors', icon: Users, action: () => onNavigate('mentors') },
        { title: 'Schedule Session', description: 'Book your next session', icon: Calendar, action: () => onNavigate('sessions') },
        { title: 'Learning Resources', description: 'Access guides and materials', icon: BookOpen, action: () => onNavigate('resources') },
        { title: 'Track Progress', description: 'View your goals and milestones', icon: Target, action: () => onNavigate('profile') }
      ]
    : [
        { title: 'View Mentees', description: 'Manage your mentee relationships', icon: Users, action: () => onNavigate('mentors') },
        { title: 'Session Calendar', description: 'Manage your availability', icon: Calendar, action: () => onNavigate('sessions') },
        { title: 'Share Resources', description: 'Upload guides for mentees', icon: BookOpen, action: () => onNavigate('resources') },
        { title: 'Performance', description: 'View ratings and feedback', icon: TrendingUp, action: () => onNavigate('profile') }
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user.role === 'mentee' 
            ? "Ready to learn something new today?" 
            : user.role === 'mentor'
            ? "Time to make a difference in someone's career!"
            : "Manage your mentorship platform"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
                stat.action ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''
              }`}
              onClick={stat.action}
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={action.action}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center p-3 rounded-lg border border-gray-200">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(session.dateTime).toLocaleDateString()} at {new Date(session.dateTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {upcomingSessions.length > 3 && (
                  <button
                    onClick={() => onNavigate('sessions')}
                    className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                  >
                    View all sessions
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                <p className="text-gray-500 mb-4">
                  {user.role === 'mentee' 
                    ? "Schedule your first mentoring session to get started!"
                    : "No sessions scheduled yet."
                  }
                </p>
                {user.role === 'mentee' && (
                  <button
                    onClick={() => onNavigate('mentors')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Find a Mentor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}