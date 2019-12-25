import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {Game} from './Game'

const App: React.FC = () => {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
