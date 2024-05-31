import React from 'react';

const MessageList = ({ messages, onEdit }) => {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg}
          <button onClick={() => onEdit(index)} className="edit-button">Editar</button>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
