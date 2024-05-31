import React, { useState } from 'react';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import './App.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSendMessage = (message) => {
    if (editMessageId !== null) {
      setMessages(messages.map((msg, index) =>
        index === editMessageId ? message : msg
      ));
      setEditMessageId(null);
      setEditText('');
    } else {
      setMessages([...messages, message]);
    }
  };

  const handleEditMessage = (id) => {
    setEditMessageId(id);
    setEditText(messages[id]);
  };

  

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Chat UPAL</h1>
      <button className="toggle-mode" onClick={toggleDarkMode}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <MessageList messages={messages} onEdit={handleEditMessage} />
      <MessageInput
        onSend={handleSendMessage}
        editMessage={editText}
        isEditing={editMessageId !== null}
      />
    </div>
  );
};

export default Chat;
