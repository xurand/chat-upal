import React, { useState, useEffect } from 'react';

const MessageInput = ({ onSend, editMessage, isEditing, onTyping }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEditing) {
      setMessage(editMessage);
    } else {
      setMessage('');
    }
  }, [editMessage, isEditing]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
      onTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Escribe un mensaje..."
        onBlur={() => onTyping(true)}
      />
      <button type="submit">{isEditing ? 'Actualizar' : 'Enviar'}</button>
    </form>
  );
};

export default MessageInput;
