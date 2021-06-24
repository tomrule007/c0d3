import React, { useCallback, useEffect, useState } from 'react';

import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ReactDOM from 'react-dom';
import UserList from './components/UserList';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

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
//   Server sends saved session settings: user name(if first session assign random name)
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
  const [messages, setMessages] = useState(mockMessages);
  const [response, setResponse] = useState('');
  const [userInfo, setUserInfo] = useState({ name: null });
  const [socketRef, setSocketRef] = useState(null);
  console.log({ socketRef });
  const handleSendMsg = useCallback(
    (msg) => {
      if (socketRef) {
        console.log('send this msg:', socketRef.id, msg);
        socketRef.emit('newMsg', msg);
      }
    },
    [socketRef]
  );
  console.log(messages)

  const handleReceivedMsg = (msgNameTime) => 
    setMessages(oldMsgs => [...oldMsgs, msgNameTime]);
  

  useEffect(() => {
    // Get or create user id
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('chatUserId', userId);
    }

    const socket = io();
    socket.emit('getUserInfo', userId);
    socket.emit('getMessageHistory');
    socket.on('messageHistory', (data)=>{
      setMessages(data);
    })
    socket.on('userInfo', (data) => {
      console.log('userInfo', { data });
      setUserInfo(data);
      setSocketRef(socket);
    });
    socket.onAny((eventName, ...args) => {
      console.log('All Events: ', eventName, args);
    });
    socket.on('newMsg', handleReceivedMsg);
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
        <ChatMessages messages={messages} />
        <ChatInput user={userInfo.name} onSend={handleSendMsg} />
      </div>
    </div>
  );
}

ReactDOM.render(<Chatroom />, document.getElementById('root'));
