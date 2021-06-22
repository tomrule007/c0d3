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

// The plan:
// user connects
//    Server sends saved session settings: user name(if first session assign random name)
//    server sends user list
//    server sends msg history
// on new msg -> append to chat
// on sendMsg -> send msg to server
// on newUser -> append to userlist
// on userLeave -> remove from userlsit
// on nameChange -> update userlist

// server events
// on new client
//    send to single client: session settings, user list, and msg history
//    broadcast new user
// on msg received
//    if msg is command excute command (/nick to change name (single response on failed))
//    else broadcast new msg with timestamp and username & append to msg history
// on client leave
//    broadcast user signed off
// on changename Command
//    if name is available
//        update user name and resend session settings to user
//        send updateName command
//        broadcast server msg: ___ is now known as ___
//    else
//        server send msg to client: ___ is not already registered
//
function Chatroom() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = io();
    socket.on('FromAPI', (data) => {
      console.log(data);
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
