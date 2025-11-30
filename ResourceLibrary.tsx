import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Video,
  Download,
  Star,
  Clock,
  User,
  Tag,
  Play,
  ExternalLink
} from 'lucide-react';

interface ResourceLibraryProps {
  onNavigate: (page: string) => void;
}

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'template' | 'video' | 'article';
  category: string;
  description: string;
  author: string;
  rating: number;
  readTime: number;
  tags: string[];
  downloadUrl?: string;
  viewUrl?: string;
  featured?: boolean;
}

export function ResourceLibrary({ onNavigate }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Sample resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'The Complete Guide to Effective Mentoring',
      type: 'guide',
      category: 'Mentoring Best Practices',
      description: 'A comprehensive guide covering everything from setting expectations to measuring success in mentoring relationships.',
      author: 'Dr. Sarah Mitchell',
      rating: 4.8,
      readTime: 15,
      tags: ['mentoring', 'best-practices', 'relationships'],
      downloadUrl: '#',
      featured: true
    },
    {
      id: '2',
      title: 'Goal Setting Template for Mentees',
      type: 'template',
      category: 'Templates',
      description: 'A structured template to help mentees define SMART goals and track progress throughout their mentoring journey.',
      author: 'MentorConnect Team',
      rating: 4.6,
      readTime: 5,
      tags: ['goals', 'template', 'planning'],
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Building Effective Communication Skills',
      type: 'video',
      category: 'Professional Development',
      description: 'Learn key communication strategies that will help you in both professional and mentoring relationships.',
      author: 'Prof. Michael Chen',
      rating: 4.9,
      readTime: 22,
      tags: ['communication', 'skills', 'professional-development'],
      viewUrl: '#',
      featured: true
    },
    {
      id: '4',
      title: 'First Session Checklist',
      type: 'template',
      category: 'Templates',
      description: 'Essential items to cover in your first mentoring session to set a strong foundation.',
      author: 'Lisa Rodriguez',
      rating: 4.7,
      readTime: 3,
      tags: ['first-session', 'checklist', 'preparation'],
      downloadUrl: '#'
    },
    {
      id: '5',
      title: 'Overcoming Career Transitions',
      type: 'article',
      category: 'Career Development',
      description: 'Strategies and insights for successfully navigating career changes with the help of mentorship.',
      author: 'James Thompson',
      rating: 4.5,
      readTime: 8,
      tags: ['career-change', 'transition', 'strategy'],
      viewUrl: '#'
    },
    {
      id: '6',
      title: 'Building Your Personal Brand',
      type: 'video',
      category: 'Professional Development',
      description: 'Master the art of personal branding to advance your career and attract the right opportunities.',
      author: 'Emma Davis',
      rating: 4.8,
      readTime: 18,
      tags: ['personal-brand', 'marketing', 'career'],
      viewUrl: '#'
    }
  ];

  const categories = Array.from(new Set(resources.map(r => r.category)));
  const types = ['guide', 'template', 'video', 'article'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesType = !selectedType || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter(r => r.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'template': return FileText;
      case 'video': return Video;
      case 'article': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'article': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
        <p className="text-gray-600 mt-2">Discover guides, templates, and insights to enhance your mentoring journey</p>
      </div>

      {/* Featured Resources */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredResources.map(resource => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {resource.rating}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-3">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-3">{resource.author}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{resource.readTime} min read</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {resource.type === 'video' ? (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </button>
                    ) : (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                placeholder="Search resources, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <TypeIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {resource.rating}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{resource.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center mb-1">
                    <User className="h-3 w-3 mr-1" />
                    {resource.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {resource.readTime} min read
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {resource.type === 'video' ? (
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </button>
                  ) : (
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Get
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or browse all available resources.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedType('');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Upload Section for Mentors/Admins */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Knowledge</h3>
        <p className="text-gray-600 mb-4">
          Have valuable resources to share with the community? Upload your guides, templates, or create video content.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <ExternalLink className="h-4 w-4 mr-2" />
          Upload Resource
        </button>
      </div>
    </div>
  );
}