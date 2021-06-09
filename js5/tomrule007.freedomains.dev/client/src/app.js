import Kanban from './Kanban';
import PokemonSearch from './pages/PokemonSearch';
import React from 'react';
import ReactDOM from 'react-dom';
import Stars from './Stars';

const { pathname } = window.location;
ReactDOM.render(
  pathname === '/react/star' ? (
    <Stars />
  ) : pathname === '/react/kanban' ? (
    <Kanban />
  ) : pathname === '/react/pokemonsearch' ? (
    <PokemonSearch />
  ) : (
    <p>
      Unknown route! Try '/react/star' or '/react/kanban' or
      '/react/pokemonsearch'
    </p>
  ),
  document.getElementById('root')
);
