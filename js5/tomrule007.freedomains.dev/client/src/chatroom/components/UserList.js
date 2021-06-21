import React from 'react';

export default function UserList({ users }) {
  return (
    <div>
      {users.map((name) => (
        <div>{name}</div>
      ))}
    </div>
  );
}
