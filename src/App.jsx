// src/App.js
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './components/firebaseConfig';
import socket from './components/socket';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import './App.css';

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [contacts, setContacts] = useState([
    { name: "Amigo", online: true },
    { name: "Madre", online: true },
    { name: "Profesor", online: false },
    { name: "Iron Man", online: true },
    { name: "Mascota", online: false }
  ]);
  const [typing, setTyping] = useState(false);
  const [currentContact, setCurrentContact] = useState(user);
  const [typingStatus, setTypingStatus] = useState({});
  const [onlineStatus, setOnlineStatus] = useState({});
  const [authMessage, setAuthMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    socket.on("message", ({ contact, message }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [contact]: [...(prevMessages[contact] || []), message],
      }));
    });

    socket.on("typing", ({ contact, isTyping }) => {
      setTypingStatus((prevStatus) => ({
        ...prevStatus,
        [contact]: isTyping,
      }));
    });

    socket.on("userStatus", (status) => {
      setOnlineStatus(status);
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("userStatus");
    };
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user.email);
        setAuthMessage({ type: 'success', message: 'Registro exitoso' });
      })
      .catch((error) => {
        setAuthMessage({ type: 'error', message: error.message });
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user.email);
        setAuthMessage({ type: 'success', message: 'Inicio de sesión exitoso' });
      })
      .catch((error) => {
        setAuthMessage({ type: 'error', message: error.message });
      });
  };

  const handleSendMessage = (message) => {
    const newMessage = { contact: currentContact, message };
    if (editMessageId !== null) {
      const updatedMessages = messages[currentContact].map((msg, index) => index === editMessageId ? message : msg);
      setMessages({ ...messages, [currentContact]: updatedMessages });
      setEditMessageId(null);
      setEditText('');
    } else {
      socket.emit("message", newMessage);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentContact]: [...(prevMessages[currentContact] || []), message],
      }));
    }
  };

  const handleEditMessage = (id) => {
    setEditMessageId(id);
    setEditText(messages[currentContact][id]);
  };

  const handleTyping = (isTyping) => {
    setTyping(isTyping);
    socket.emit("typing", { contact: currentContact, isTyping });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleContactClick = (contact) => {
    setCurrentContact(contact);
    setTyping(false);
    setEditMessageId(null);
    setEditText('');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h1>Firebase Authentication</h1>
        {authMessage.message && (
          <div className={`auth-message ${authMessage.type}`}>
            {authMessage.message}
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
    <header className="header">
      <h1>Chat UPAL</h1>
      <label>Bienvenido: {user}</label>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
  </header>
      <div className="main-content">
        <aside className="sidebar">
          <h2>Contactos</h2>
          <ul>
            {contacts.map((contact, index) => (
              <li key={index} onClick={() => handleContactClick(contact.name)} className={currentContact === contact.name ? 'active' : ''}>
                {contact.name}
                <span className={`status ${contact.online ? 'online' : 'offline'}`}></span>
              </li>
            ))}
          </ul>
        </aside>
        <section className="chat-area">
          <header className="chat-header">
            <h3>{currentContact}</h3>
            <span className={`status ${onlineStatus[currentContact] ? 'online' : 'offline'}`}></span>
          </header>
          <MessageList messages={messages[currentContact] || []} onEdit={handleEditMessage} />
          {typingStatus[currentContact] && <div className="typing-status">{currentContact} está escribiendo...</div>}
          <MessageInput
            onSend={handleSendMessage}
            editMessage={editText}
            isEditing={editMessageId !== null}
            onTyping={handleTyping}
          />
          <label>{typing ? "Escribiendo..." : ""}</label>
        </section>
      </div>
    </div>
  );
};

export default App;
