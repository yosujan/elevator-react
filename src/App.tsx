import React from 'react';
import './App.css';
import Elevator from "./components/Elevator";

function App() {
  return (
    <div className="App">
      <Elevator totalFloors={7} idleTime={4} idlePosition={4} />
    </div>
  );
}

export default App;
