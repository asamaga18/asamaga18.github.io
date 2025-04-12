import { Message, ChatConversation, ChatUser } from './types';

// This will be replaced with actual API calls later
const MOCK_DELAY = 500;

export class ChatService {
  private static baseUrl = 'http://localhost:8000/chat';
  private static userId = 'test-user-1'; // Temporary user ID for testing

  private static async makeRequest(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': this.userId,
        },
      });
      
      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  static async createChat(members: string[]): Promise<string> {
    const data = await this.makeRequest(`${this.baseUrl}/create`, {
      method: 'POST',
      body: JSON.stringify({
        participant_ids: [this.userId],
        name: "New Chat",
        type: "direct"
      }),
    });
    
    return data.id;
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const messages = await this.makeRequest(`${this.baseUrl}/${chatId}/messages`);
    
    return messages.map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender.id,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      read: true
    }));
  }

  static async sendMessage(message: { senderId: string, content: string, chatId: string }): Promise<Message> {
    const data = await this.makeRequest(`${this.baseUrl}/message`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: message.chatId,
        content: message.content
      }),
    });

    return {
      id: data.id,
      senderId: data.sender.id,
      content: data.content,
      timestamp: new Date(data.timestamp),
      read: false
    };
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