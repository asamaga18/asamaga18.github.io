import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatService } from './chatService';
import Sidebar from '../components/Sidebar';
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

interface FakeContact {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  produceType: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentChatName, setCurrentChatName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [fakeContacts, setFakeContacts] = useState<FakeContact[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContactsList, setShowContactsList] = useState(true);
  const [selectedContact, setSelectedContact] = useState<FakeContact | null>(null);

  // Check if user has set a location
  useEffect(() => {
    const locationData = localStorage.getItem('location');
    
    if (!locationData || locationData === '[]') {
      // Redirect to account settings if no location is set
      alert('Please set your location in Account Settings before accessing chat features.');
      navigate('/account');
    } else {
      try {
        const locations = JSON.parse(locationData);
        if (locations.length > 0) {
          setUserLocation(locations[0].value);
          // Generate fake contacts when location is set
          generateFakeContacts(locations[0].value);
        } else {
          alert('Please set your location in Account Settings before accessing chat features.');
          navigate('/account');
        }
      } catch (error) {
        console.error('Error parsing location data:', error);
      }
    }
  }, [navigate]);

  // Generate fake contacts from the user's location
  const generateFakeContacts = (location: string) => {
    const firstNames = ['John', 'Emily', 'Michael', 'Sarah', 'David', 'Laura', 'Robert', 'Jessica', 'William', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    const produceTypes = ['Tomatoes', 'Peppers', 'Lettuce', 'Cucumbers', 'Carrots', 'Radishes', 'Spinach', 'Potatoes', 'Onions', 'Garlic'];
    
    const contacts = Array.from({ length: 8 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const produceType = produceTypes[Math.floor(Math.random() * produceTypes.length)];
      
      return {
        id: `fake-${i}`,
        name: `${firstName} ${lastName}`,
        location: location,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        produceType: produceType
      };
    });
    
    setFakeContacts(contacts);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId) return;

    try {
      // If chatting with a fake contact, create a fake response instead of calling the API
      if (selectedContact && currentChatId.startsWith('fake-')) {
        // Add the user's message
        const userMessage: Message = {
          id: `msg-${Date.now()}-user`,
          content: newMessage.trim(),
          sender: {
            id: localStorage.getItem('user_id') || 'current-user',
            first_name: localStorage.getItem('user_first_name') || 'You',
            last_name: localStorage.getItem('user_last_name') || '',
          },
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        
        // Generate a response after a short delay
        setTimeout(() => {
          const responses = [
            `I have some great ${selectedContact.produceType} available right now.`,
            `Thanks for reaching out! I'm based in ${selectedContact.location}.`,
            `I'd be happy to discuss trading some ${selectedContact.produceType}.`,
            `How much ${selectedContact.produceType} are you looking for?`,
            `My ${selectedContact.produceType} are organically grown. Would you like to meet up to see them?`
          ];
          
          const responseMessage: Message = {
            id: `msg-${Date.now()}-response`,
            content: responses[Math.floor(Math.random() * responses.length)],
            sender: {
              id: selectedContact.id,
              first_name: selectedContact.name.split(' ')[0],
              last_name: selectedContact.name.split(' ')[1] || '',
            },
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, 1000);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const startChatWithFakeContact = (contact: FakeContact) => {
    setCurrentChatId(contact.id);
    setCurrentChatName(contact.name);
    setSelectedContact(contact);
    setShowContactsList(false);
    
    // Create initial welcome message from fake contact
    const initialMessage: Message = {
      id: `msg-${Date.now()}`,
      content: `Hello! I'm ${contact.name} from ${contact.location}. I specialize in growing ${contact.produceType}. How can I help you today?`,
      sender: {
        id: contact.id,
        first_name: contact.name.split(' ')[0],
        last_name: contact.name.split(' ')[1] || '',
      },
      timestamp: new Date().toISOString()
    };
    
    setMessages([initialMessage]);
  };

  if (showContactsList) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="chat-container">
          <div className="chat-header">
            <h2>Contact Information</h2>
          </div>
          
          {userLocation && (
            <div className="location-contacts-section">
              <h3 className="location-header">People from {userLocation}</h3>
              
              <div className="contacts-list">
                {fakeContacts.map(contact => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-details">
                      <div><strong>Location:</strong> {contact.location}</div>
                      <div><strong>Phone:</strong> {contact.phone}</div>
                      <div><strong>Email:</strong> {contact.email}</div>
                      <div><strong>Specialty:</strong> {contact.produceType}</div>
                    </div>
                    <button 
                      className="contact-message-btn"
                      onClick={() => startChatWithFakeContact(contact)}
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="chat-container">
        <div className="chat-header">
          <h2>
            {selectedContact ? `Chat with ${selectedContact.name}` : 'Messages'}
          </h2>
          <button 
            onClick={() => setShowContactsList(true)}
            className="new-chat-btn"
          >
            Back to Contacts
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
    </div>
  );
};

export default Chat; 