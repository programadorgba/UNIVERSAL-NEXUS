import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import './CharacterGrid.css';

const DragonBallGrid = () => {
  const navigate = useNavigate();
  
  const characters = [
    { id: 1, name: 'Goku', image: 'https://dragonball-api.com/characters/goku_normal.webp', race: 'Saiyan' },
    { id: 2, name: 'Vegeta', image: 'https://dragonball-api.com/characters/vegeta_normal.webp', race: 'Saiyan' },
    { id: 3, name: 'Piccolo', image: 'https://dragonball-api.com/characters/piccolo_normal.webp', race: 'Namekian' },
    { id: 4, name: 'Frieza', image: 'https://dragonball-api.com/characters/freezer_normal.webp', race: 'Frieza Race' },
  ];

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #1a0b00 0%, #000000 100%)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/dragonball.webp" alt="Dragon Ball" />
        </div>
      </aside>

      <main className="main-content">
        <header className="grid-header">
           <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            Volver
          </button>
           <div className="search-form">
             <input type="text" className="search-input" placeholder="Buscar..." disabled />
             <button className="search-btn"><Search size={20} /> Buscar</button>
          </div>
        </header>

        <div className="characters-grid">
          {characters.map((char) => (
            <div key={char.id} className="character-card" style={{ "--border-color": "#f97316" }}>
              <div className="card-glow"></div>
              <div className="card-id">#{char.id}</div>
              <div className="card-image-container">
                <img src={char.image} alt={char.name} className="card-image" />
              </div>
              <div className="card-info">
                <h3 className="card-name">{char.name}</h3>
                <div className="card-badges">
                  <span className="badge" style={{ backgroundColor: "#f97316" }}>{char.race}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DragonBallGrid;
