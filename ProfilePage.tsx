import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Star, 
  Calendar, 
  Target,
  Edit3,
  Save,
  X
} from 'lucide-react';
import type { User as UserType } from '../App';

interface ProfilePageProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onUpdateUser: (userId: string, userData: Partial<UserType>) => Promise<boolean>;
}

export function ProfilePage({ user, onNavigate, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio || '',
    skills: user.skills?.join(', ') || '',
    experience: user.experience || '',
    goals: user.goals?.join(', ') || '',
    availability: user.availability?.join(', ') || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData: Partial<UserType> = {
        name: editForm.name,
        bio: editForm.bio,
        ...(user.role === 'mentor' 
          ? {
              skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
              experience: editForm.experience
            }
          : {
              goals: editForm.goals.split(',').map(g => g.trim()).filter(g => g)
            }
        ),
        availability: editForm.availability.split(',').map(a => a.trim()).filter(a => a)
      };

      const success = await onUpdateUser(user.id, updateData);
      if (success) {
        setIsEditing(false);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
      experience: user.experience || '',
      goals: user.goals?.join(', ') || '',
      availability: user.availability?.join(', ') || ''
    });
    setIsEditing(false);
  };

  const progressData = [
    { label: 'React Proficiency', current: 75, target: 90 },
    { label: 'Leadership Skills', current: 60, target: 80 },
    { label: 'Communication', current: 85, target: 95 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="ml-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              )}
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                  {user.role}
                </span>
                {user.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-gray-600">{user.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-600">
                {user.bio || 'No bio provided yet. Click Edit Profile to add one.'}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {user.role === 'mentor' ? 'Skills & Expertise' : 'Skills'}
            </h2>
            {isEditing ? (
              <input
                type="text"
                value={editForm.skills}
                onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, Node.js, Leadership (comma-separated)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Experience (for mentors) / Goals (for mentees) */}
          {user.role === 'mentor' ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
              {isEditing ? (
                <select
                  value={editForm.experience}
                  onChange={(e) => setEditForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select experience</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-8 years">5-8 years</option>
                  <option value="8+ years">8+ years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              ) : (
                <p className="text-gray-600">
                  {user.experience || 'No experience level specified.'}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Goals</h2>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.goals}
                  onChange={(e) => setEditForm(prev => ({ ...prev, goals: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Career growth, skill development (comma-separated)"
                />
              ) : (
                <div className="space-y-2">
                  {user.goals && user.goals.length > 0 ? (
                    user.goals.map((goal, index) => (
                      <div key={index} className="flex items-center">
                        <Target className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No goals set yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats and Progress */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user.totalSessions || 0}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user.rating || 'N/A'}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Progress Tracking (for mentees) */}
          {user.role === 'mentee' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h2>
              <div className="space-y-4">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{item.label}</span>
                      <span>{item.current}% of {item.target}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.current / item.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
            {isEditing ? (
              <input
                type="text"
                value={editForm.availability}
                onChange={(e) => setEditForm(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Monday 9-11 AM, Wednesday 2-4 PM (comma-separated)"
              />
            ) : (
              <div className="space-y-2">
                {user.availability && user.availability.length > 0 ? (
                  user.availability.map((slot, index) => (
                    <div key={index} className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700">{slot}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No availability specified.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}