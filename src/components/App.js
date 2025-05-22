import React, { useState } from 'react';
import '../styles/App.css';

const difficultyMap = {
  easy: 4,
  normal: 8,
  hard: 16
};

const App = () => {
  const [level, setLevel] = useState('');
  const [started, setStarted] = useState(false);
  const [tries, setTries] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [matched, setMatched] = useState([]);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const handleStart = () => {
    if (!level) return alert('Please select a difficulty level');
    const count = difficultyMap[level];
    const values = shuffle([...Array(count).keys(), ...Array(count).keys()]);
    const tileObjects = values.map((val, index) => ({ id: index, value: val, flipped: false }));
    setTiles(tileObjects);
    setStarted(true);
    setMatched([]);
    setTries(0);
    setFirst(null);
    setSecond(null);
  };

  const handleClick = (tile) => {
    if (tile.flipped || second) return;

    const updatedTiles = tiles.map(t =>
      t.id === tile.id ? { ...t, flipped: true } : t
    );
    setTiles(updatedTiles);

    if (!first) {
      setFirst(tile);
    } else {
      setSecond(tile);
      setTries(prev => prev + 1);
      if (first.value === tile.value) {
        setMatched([...matched, first.value]);
        setFirst(null);
        setSecond(null);
      } else {
        setTimeout(() => {
          setTiles(prev =>
            prev.map(t =>
              t.id === first.id || t.id === tile.id ? { ...t, flipped: false } : t
            )
          );
          setFirst(null);
          setSecond(null);
        }, 800);
      }
    }
  };

  const isWin = matched.length === tiles.length / 2;

  return (
    <div className="App">
      {!started ? (
        <div className="levels_container">
          <h1>Welcome!</h1>
         {Object.keys(difficultyMap).map((diff) => (
  <label key={diff} htmlFor={diff}>
    <input
      type="radio"
      name="difficulty"
      id={diff}             // <-- added id here
      value={diff}
      onChange={() => setLevel(diff)}
    />{' '}
    {diff}
  </label>
))}

          <br />
          <button id="startBtn" onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div className="game_container">
           <h4>Select a tile to match pairs!</h4> 
          <h1>GAmE YO</h1>
          <h4>{tries}</h4>
          <p>Tries: <span id="tries">{tries}</span></p>
          <div className="cells_container" style={{ gridTemplateColumns: `repeat(${Math.sqrt(tiles.length)}, 100px)` }}>
            {tiles.map((tile) => (
              <div
                key={tile.id}
                className={`cell ${tile.flipped || matched.includes(tile.value) ? 'flipped' : ''}`}
                onClick={() => handleClick(tile)}
              >
                {tile.flipped || matched.includes(tile.value) ? tile.value : ''}
              </div>
            ))}
          </div>
          {isWin && <p id="message">ALL SOLVED!</p>}
          <button id="resetBtn" onClick={() => setStarted(false)}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default App;

