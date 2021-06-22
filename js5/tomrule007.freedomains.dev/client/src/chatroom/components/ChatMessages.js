import React from 'react';

export default function ChatMessages({ messages }) {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        margin: '10px',
      }}
    >
      {messages.map(({ time, name, msg }, index) => (
        <div style={{ borderTop: '1px solid black' }} key={index}>
          <b>{name}</b> <small>{new Date(time).toLocaleString()}</small>
          <div style={{ marginTop: '3px' }}>{msg}</div>
        </div>
      ))}
    </div>
  );
}
