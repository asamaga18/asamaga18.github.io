import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Chat.css';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

interface ChatContact {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
  unread: number;
}

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey, I'm interested in your tomatoes!", sender: "them", timestamp: "10:30 AM" },
    { id: 2, text: "They're still available! When would you like to pick them up?", sender: "me", timestamp: "10:32 AM" },
    { id: 3, text: "Could I come by tomorrow at 2pm?", sender: "them", timestamp: "10:33 AM" },
    { id: 4, text: "Sure, that works for me!", sender: "me", timestamp: "10:35 AM" }
  ]);

  const contacts: ChatContact[] = [
    { id: 1, name: "John Doe", lastMessage: "Sure, that works for me!", avatar: "JD", unread: 0 },
    { id: 2, name: "Alice Smith", lastMessage: "Is this still available?", avatar: "AS", unread: 2 },
    { id: 3, name: "Bob Johnson", lastMessage: "Thanks!", avatar: "BJ", unread: 0 }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-header">
            <h2>Messages</h2>
          </div>
          <div className="contacts-list">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact === contact.id ? 'selected' : ''}`}
                onClick={() => setSelectedContact(contact.id)}
              >
                <div className="contact-avatar">{contact.avatar}</div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-message">{contact.lastMessage}</div>
                </div>
                {contact.unread > 0 && (
                  <div className="unread-badge">{contact.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedContact ? (
            <>
              <div className="chat-header">
                <h2>{contacts.find(c => c.id === selectedContact)?.name}</h2>
              </div>
              <div className="messages-container">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}>
                    {message.text}
                    <div className="message-time">{message.timestamp}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-input-container">
                <input
                  type="text"
                  className="message-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="placeholder-text">Select a conversation to start messaging</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 