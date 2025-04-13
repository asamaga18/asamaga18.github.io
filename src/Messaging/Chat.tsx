import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from './chatService';
import UserSearch from './UserSearch';
import './Chat.css';

interface Message {
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

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserSearch, setShowUserSearch] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentChatId) {
      loadMessages();
    }
  }, [currentChatId]);

  const loadMessages = async () => {
    if (!currentChatId) return;
    
    try {
      const fetchedMessages = await ChatService.getMessages(currentChatId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId) return;

    try {
      const message = await ChatService.sendMessage(currentChatId, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
    setShowUserSearch(false);
  };

  if (showUserSearch) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>Messages</h2>
        </div>
        <UserSearch onChatCreated={handleChatCreated} />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Messages</h2>
        <button 
          onClick={() => setShowUserSearch(true)}
          className="new-chat-btn"
        >
          New Chat
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender.id === localStorage.getItem('user_id')
                ? 'sent'
                : 'received'
            }`}
          >
            <div className="message-content">
              <div className="message-sender">
                {message.sender.first_name} {message.sender.last_name}
              </div>
              <div className="message-text">{message.content}</div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 