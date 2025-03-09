import React from 'react';
import Game from './components/game/Game';
import { GameProvider } from './game/state/GameContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}

export default App;
