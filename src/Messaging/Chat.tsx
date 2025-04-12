import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from './chatService';
import { Message, ChatConversation, ChatUser } from './types';
import Sidebar from '../components/Sidebar';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const messages = await ChatService.getMessages('default-conversation');
        setMessages(messages);
        scrollToBottom();
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await ChatService.sendMessage({
        senderId: 'current-user-id', // Replace with actual user ID
        receiverId: 'other-user-id', // Replace with actual recipient ID
        content: newMessage,
        read: false
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="chat-container">
        <div className="chat-main">
          <div className="chat-header">
            <h3>Messages</h3>
          </div>
          <div className="messages-container">
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === 'current-user-id' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" disabled={!newMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 