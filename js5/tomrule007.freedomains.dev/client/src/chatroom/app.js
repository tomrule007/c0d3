import React, { useEffect, useState } from 'react';

import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ReactDOM from 'react-dom';
import UserList from './components/UserList';
import io from 'socket.io-client';

const mockUsers = ['tom', 'tommy', 'thomas', 'tami'];
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
function Chatroom() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = io();
    socket.on('FromAPI', (data) => {
      setResponse(data);
    });
  }, []);
  return (
    <div style={{ display: 'flex' }}>
      <UserList users={mockUsers} />
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <ChatMessages messages={mockMessages} />
        <ChatInput />
      </div>
    </div>
  );
}

ReactDOM.render(<Chatroom />, document.getElementById('root'));
