import React from 'react';

export default function ChatInput() {
  return (
    <div style={{ display: 'flex' }}>
      <input type="text" style={{ flex: 1 }}></input>
      <button>Send</button>
    </div>
  );
}
