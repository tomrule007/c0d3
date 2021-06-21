import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import React from 'react';
import ReactDOM from 'react-dom';
import UserList from './components/UserList';

const mockUsers = ['tom', 'tommy', 'thomas', 'tami'];

function Chatroom() {
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
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}

ReactDOM.render(<Chatroom />, document.getElementById('root'));
