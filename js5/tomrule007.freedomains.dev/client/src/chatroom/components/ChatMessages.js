import React from 'react';

const mockMessages = [
  {
    time: Date.now(),
    name: 'tom',
    msg: 'hello everybody',
  },
];
export default function ChatMessages() {
  return (
    <div style={{ flex: 1, margin: '10px' }}>
      {mockMessages.map(({ time, name, msg }, index) => (
        <div key={index}>
          <span>
            <b>{name}</b>
          </span>
          <div></div>
        </div>
      ))}
    </div>
  );
}
