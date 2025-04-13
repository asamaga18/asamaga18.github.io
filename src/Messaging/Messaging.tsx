import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService } from './chatService';
import { ChatConversation, Message } from './types';
import UserSearch from './UserSearch';
import Chat from './Chat';
import './Messaging.css';

const Messaging = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      console.log('Loading messages for chat:', selectedChat);
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ChatService.getConversations();
      console.log('Loaded conversations:', response);
      setConversations(response);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const messages = await ChatService.getMessages(chatId);
      console.log('Loaded messages:', messages);
      setMessages(messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async (userId: string) => {
    try {
      setLoading(true);
      // Create a new chat with the selected user
      const newChat = await ChatService.createDirectChat(userId);
      console.log('Created new chat:', newChat);
      
      // Add the new chat to conversations
      setConversations(prev => [...prev, {
        ...newChat,
        messages: [] // Initialize with empty messages array
      }]);
      
      // Select the new chat
      setSelectedChat(newChat.id);
      
      // Load messages for the new chat
      await loadMessages(newChat.id);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChat) return;
    
    try {
      const newMessage = await ChatService.sendMessage(selectedChat, content);
      console.log('Sent message:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="messaging-container">
      <div className="messaging-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
      </div>
      <div className="messaging-content">
        <div className="messaging-sidebar">
          <UserSearch onChatCreated={handleNewChat} />
          <div className="conversations-list">
            {conversations.map(chat => (
              <div
                key={chat.id}
                className={`conversation-item ${selectedChat === chat.id ? 'selected' : ''}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="conversation-avatar">
                  {chat.participants[0].profile_picture ? (
                    <img src={chat.participants[0].profile_picture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {chat.participants[0].first_name[0]}
                    </div>
                  )}
                </div>
                <div className="conversation-info">
                  <h3>{chat.name}</h3>
                  {/* Add last message preview here if needed */}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-window">
          {selectedChat ? (
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>Select a conversation or start a new one</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;