import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from './chatService';
import { Message } from './types';
import Sidebar from '../components/Sidebar';
import './Chat.css';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create or get chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get existing chat ID from localStorage
        let existingChatId = localStorage.getItem('currentChatId');
        
        if (!existingChatId) {
          // If no existing chat, create a new one
          const newChatId = await ChatService.createChat(['test-user-1']);
          console.log('Created new chat with ID:', newChatId);
          localStorage.setItem('currentChatId', newChatId);
          existingChatId = newChatId;
        } else {
          // Verify the chat exists by trying to fetch messages
          try {
            await ChatService.getMessages(existingChatId);
          } catch (err) {
            console.log('Existing chat not found, creating new one');
            localStorage.removeItem('currentChatId');
            const newChatId = await ChatService.createChat(['test-user-1']);
            console.log('Created new chat with ID:', newChatId);
            localStorage.setItem('currentChatId', newChatId);
            existingChatId = newChatId;
          }
        }
        
        setChatId(existingChatId);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  // Fetch messages when chat is initialized
  useEffect(() => {
    let isSubscribed = true;
    
    const fetchMessages = async () => {
      if (!chatId || !isSubscribed) return;
      
      try {
        const messages = await ChatService.getMessages(chatId);
        if (isSubscribed) {
          console.log('Fetched messages:', messages);
          if (Array.isArray(messages)) {
            setMessages(messages);
            scrollToBottom();
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        if (isSubscribed) {
          setError('Failed to load messages. Please try again.');
        }
      }
    };

    fetchMessages();
    // Poll less frequently (every 5 seconds) to reduce server load
    const interval = setInterval(fetchMessages, 5000);
    
    // Cleanup function to prevent memory leaks
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      setError(null);
      console.log('Sending message to chat:', chatId);
      const message = await ChatService.sendMessage({
        senderId: 'current-user',
        content: newMessage,
        chatId: chatId
      });

      console.log('Message sent:', message);
      if (message && message.id) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        scrollToBottom();
      } else {
        setError('Failed to send message. Invalid response from server.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  if (loading && !chatId) {
    return <div className="loading">Initializing chat...</div>;
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="chat-container">
        <div className="chat-main">
          <div className="chat-header">
            <h3>Messages</h3>
          </div>
          <div className="messages-container">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="no-messages">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === 'current-user' ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{message.content}</div>
                      <div className="message-timestamp">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
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
              disabled={!chatId}
            />
            <button type="submit" disabled={!newMessage.trim() || !chatId || loading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 