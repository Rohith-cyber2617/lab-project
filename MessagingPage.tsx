import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Video, 
  Phone,
  MoreHorizontal,
  Calendar,
  User,
  Star,
  Circle
} from 'lucide-react';
import type { Message, User as UserType } from '../App';

interface MessagingPageProps {
  messages: Message[];
  currentUser: UserType;
  users: UserType[];
  onNavigate: (page: string) => void;
  onSendMessage: (messageData: Omit<Message, 'id'>) => Promise<Message | null>;
}

interface Conversation {
  id: string;
  participantId: string;
  lastMessage: Message;
  unreadCount: number;
}

export function MessagingPage({ messages, currentUser, users, onNavigate, onSendMessage }: MessagingPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Group messages by conversation
  const conversations: Conversation[] = [];
  const conversationMap = new Map<string, Message[]>();

  messages.forEach(message => {
    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, []);
    }
    conversationMap.get(otherUserId)!.push(message);
  });

  conversationMap.forEach((msgs, participantId) => {
    const sortedMsgs = msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const unreadCount = msgs.filter(m => m.receiverId === currentUser.id && !m.read).length;
    
    conversations.push({
      id: participantId,
      participantId,
      lastMessage: sortedMsgs[0],
      unreadCount
    });
  });

  // Sort conversations by last message time
  conversations.sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  const selectedMessages = selectedConversation 
    ? (conversationMap.get(selectedConversation) || []).sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    : [];

  const selectedParticipant = selectedConversation 
    ? users.find(u => u.id === selectedConversation)
    : null;

  const filteredConversations = conversations.filter(conv => {
    const participant = users.find(u => u.id === conv.participantId);
    return !searchTerm || 
      participant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsSending(true);
    try {
      const messageData = {
        senderId: currentUser.id,
        receiverId: selectedConversation,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };

      const sentMessage = await onSendMessage(messageData);
      if (sentMessage) {
        setNewMessage('');
        // The message will be added to the list via the parent component's state update
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => {
                    const participant = users.find(u => u.id === conversation.participantId);
                    const isSelected = selectedConversation === conversation.id;
                    
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 border' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {participant?.name || 'Unknown User'}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.senderId === currentUser.id && 'You: '}
                                {conversation.lastMessage.content}
                              </p>
                              {participant?.role && (
                                <span className="text-xs text-gray-500 capitalize ml-2">
                                  {participant.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No conversations found' : 'No messages yet'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && selectedParticipant ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedParticipant.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Circle className="h-2 w-2 text-green-500 mr-2" />
                        <span className="capitalize">{selectedParticipant.role}</span>
                        {selectedParticipant.rating && (
                          <>
                            <span className="mx-2">•</span>
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span>{selectedParticipant.rating}/5</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => onNavigate('sessions')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Calendar className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages.map((message) => {
                    const isFromCurrentUser = message.senderId === currentUser.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isFromCurrentUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={isSending}
                      />
                    </div>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <button
                      onClick={() => onNavigate('sessions')}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule Session
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}