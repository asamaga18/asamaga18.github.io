import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import './Chat.css';

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  loading: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, loading }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Messages</h2>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          messages.map((message) => (
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={loading}
        />
        <button type="submit" className="send-button" disabled={loading || !newMessage.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat; 