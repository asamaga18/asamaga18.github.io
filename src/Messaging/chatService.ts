import { Message, ChatConversation, ChatUser } from './types';

// This will be replaced with actual API calls later
const MOCK_DELAY = 500;

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface Chat {
  id: string;
  name: string;
  type: string;
  participants: User[];
}

export class ChatService {
  private static baseUrl = 'http://localhost:8000';
  private static userId = 'test-user-1'; // Temporary user ID for testing
  private static timeout = 10000; // 10 second timeout

  private static async makeRequest(url: string, options?: RequestInit) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
          ...options?.headers,
        },
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        if (response.status === 401) {
          throw new Error('Not authenticated');
        } else if (response.status === 404) {
          throw new Error('Not found');
        } else {
          throw new Error(errorData || 'Request failed');
        }
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      console.error('Request failed:', error);
      throw error;
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    return this.makeRequest(`${this.baseUrl}/users/search?query=${encodeURIComponent(query)}`);
  }

  static async createDirectChat(userId: string): Promise<Chat> {
    return this.makeRequest(`${this.baseUrl}/chat/direct/${userId}`, {
      method: 'POST'
    });
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    return this.makeRequest(`${this.baseUrl}/chat/${chatId}/messages`);
  }

  static async sendMessage(chatId: string, content: string): Promise<Message> {
    return this.makeRequest(`${this.baseUrl}/chat/message`, {
      method: 'POST',
      body: JSON.stringify({ chat_id: chatId, content })
    });
  }

  static async markAsRead(messageIds: string[]): Promise<void> {
    // TODO: Implement when needed
  }

  static async getUserProfile(userId: string): Promise<ChatUser> {
    // TODO: Implement when needed
    return {
      id: userId,
      name: 'User',
    };
  }
} 