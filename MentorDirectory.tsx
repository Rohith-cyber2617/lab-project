import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MessageSquare,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import type { User } from '../App';

interface MentorDirectoryProps {
  users: User[];
  currentUser: User;
  onNavigate: (page: string) => void;
}

export function MentorDirectory({ users, currentUser, onNavigate }: MentorDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  // Get all unique skills
  const allSkills = Array.from(
    new Set(users.flatMap(user => user.skills || []))
  ).sort();

  // Filter mentors
  const filteredMentors = users.filter(user => {
    if (!searchTerm && !selectedSkill && !selectedExperience) return true;
    
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !selectedSkill || user.skills?.includes(selectedSkill);
    
    const matchesExperience = !selectedExperience || user.experience === selectedExperience;
    
    return matchesSearch && matchesSkill && matchesExperience;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Mentor</h1>
        <p className="text-gray-600">Connect with experienced professionals who can guide your career journey</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, skills, or experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skill Filter */}
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Experience</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-8 years">5-8 years</option>
              <option value="8+ years">8+ years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mentor Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{mentor.rating || 'New'}</span>
                    {mentor.totalSessions && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{mentor.totalSessions} sessions</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {mentor.skills && mentor.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{mentor.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Experience */}
            {mentor.experience && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{mentor.experience} experience</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => onNavigate('sessions')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </button>
              <button 
                onClick={() => onNavigate('messages')}
                className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or browse all available mentors.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSkill('');
              setSelectedExperience('');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}