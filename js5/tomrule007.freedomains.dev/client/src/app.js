import Kanban from './Kanban';
import React from 'react';
import ReactDOM from 'react-dom';
import Stars from './Stars';

const { pathname } = window.location;
ReactDOM.render(
  pathname === '/react/star' ? (
    <Stars />
  ) : pathname === '/react/kanban' ? (
    <Kanban />
  ) : (
    <p> Unknown route! Try '/js6/p3/star' or '/js6/p3/kanban' </p>
  ),
  document.getElementById('root')
);
