import { Message, ChatConversation, ChatUser } from './types';

// This will be replaced with actual API calls later
const MOCK_DELAY = 500;

export class ChatService {
  private static baseUrl = 'https://api.thetomatotrade.tech'; // Replace with your actual API URL

  static async getConversations(userId: string): Promise<ChatConversation[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return [];
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return [];
  }

  static async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      ...message,
      id: Math.random().toString(),
      timestamp: new Date(),
    };
  }

  static async markAsRead(messageIds: string[]): Promise<void> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  }

  static async getUserProfile(userId: string): Promise<ChatUser> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      id: userId,
      name: 'User',
    };
  }
} 