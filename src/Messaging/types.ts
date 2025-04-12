export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
  };
  timestamp: string;
}

export interface ChatUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  type: string;
  participants: ChatUser[];
  messages: Message[];
} 