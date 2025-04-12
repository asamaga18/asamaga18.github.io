export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: Date;
}

export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
} 