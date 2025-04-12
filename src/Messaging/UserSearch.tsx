import React, { useState } from 'react';
import { ChatService } from './chatService';
import './UserSearch.css';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface UserSearchProps {
  onChatCreated: (chatId: string) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent form submission if called from form submit
    
    if (searchQuery.length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await ChatService.searchUsers(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No users found matching your search');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Request timed out') {
          setError('Search request timed out. Please try again.');
        } else if (err.message === 'Not authenticated') {
          setError('Please sign in to search for users');
        } else {
          setError('Failed to search users. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setError(null); // Clear any previous errors
    if (e.target.value.length === 0) {
      setSearchResults([]); // Clear results when input is empty
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      setIsLoading(true);
      const chat = await ChatService.createDirectChat(userId);
      onChatCreated(chat.id);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Not authenticated') {
          setError('Please sign in to start a chat');
        } else {
          setError('Failed to create chat. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Chat creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-search">
      <form onSubmit={handleSearch} className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || searchQuery.length < 2}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {error && <div className="search-error">{error}</div>}

      <div className="search-results">
        {searchResults.map((user) => (
          <div key={user.id} className="user-result">
            <div className="user-info">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt={`${user.first_name}'s avatar`} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.first_name[0]}
                </div>
              )}
              <div className="user-details">
                <div className="user-name">{user.first_name} {user.last_name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <button
              onClick={() => handleStartChat(user.id)}
              className="start-chat-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Starting chat...' : 'Message'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch; 