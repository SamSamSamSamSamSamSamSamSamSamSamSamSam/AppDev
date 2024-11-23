import React, { useState } from 'react';
import '../Styles/ChatBotModal.css';

const ChatBotMiniChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Control the visibility of the chatbox

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  
    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userInput },
    ]);
  
    // Clear input field
    setUserInput('');
  
    const apiEndpoint = 'AIzaSyC-EoKqeKAIS2Rbs7Yc884YYrEtiDF0XRs'; // Make sure this is your actual endpoint
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });
  
      // Check if response is OK
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message returned by the API
        console.error('API error status:', response.status);
        console.error('API error message:', errorMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: `Error: ${errorMessage}` },
        ]);
        return;
      }
      
      const data = await response.json();
      console.log('API Response:', data);
  
      // Add AI response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: data.reply }, // Adjust this based on your API response
      ]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'Sorry, there was an error. Please try again later.' },
      ]);
    }
  };
  

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
     

      {  (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <h2>Chatbot</h2>
          </div>

          <div className="chatbot-body">
            <div className="chat-history">
              {messages.map((message, index) => (
                <div key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotMiniChatBox;
