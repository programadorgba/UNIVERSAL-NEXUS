import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import './CharacterGrid.css';

const LOTRGrid = () => {
  const navigate = useNavigate();
  
  const characters = [
    { id: 1, name: 'Aragorn', image: 'https://upload.wikimedia.org/wikipedia/en/3/35/Aragorn300ppx.png', race: 'Human' },
    { id: 2, name: 'Legolas', image: 'https://upload.wikimedia.org/wikipedia/en/3/32/Legolas.jpg', race: 'Elf' },
    { id: 3, name: 'Gimli', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Gimli_With_Axe.jpg/220px-Gimli_With_Axe.jpg', race: 'Dwarf' },
    { id: 4, name: 'Gandalf', image: 'https://upload.wikimedia.org/wikipedia/en/e/e9/Gandalf600ppx.jpg', race: 'Maia' },
  ];

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #051a05 0%, #000000 100%)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/lotr.webp" alt="LOTR" />
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
            <div key={char.id} className="character-card" style={{ "--border-color": "#10b981" }}>
              <div className="card-glow"></div>
              <div className="card-id">#{char.id}</div>
              <div className="card-image-container">
                <img src={char.image} alt={char.name} className="card-image" />
              </div>
              <div className="card-info">
                <h3 className="card-name">{char.name}</h3>
                <div className="card-badges">
                  <span className="badge" style={{ backgroundColor: "#10b981" }}>{char.race}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LOTRGrid;
