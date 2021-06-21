import React from 'react';

const mockMessages = [
  {
    time: Date.now(),
    name: 'tom',
    msg: 'hello everybody',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'hello',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'goodbye',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
  {
    time: Date.now(),
    name: 'tom',
    msg: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis enim sequi odio! Necessitatibus soluta laboriosam vero, numquam quisquam rerum aliquam maxime fugiat aut voluptatem, neque delectus dolorem adipisci, libero quia?',
  },
];
export default function ChatMessages() {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        margin: '10px',
      }}
    >
      {mockMessages.map(({ time, name, msg }, index) => (
        <div style={{ borderTop: '1px solid black' }} key={index}>
          <b>{name}</b> <small>{new Date(time).toLocaleString()}</small>
          <div style={{ marginTop: '3px' }}>{msg}</div>
        </div>
      ))}
    </div>
  );
}
