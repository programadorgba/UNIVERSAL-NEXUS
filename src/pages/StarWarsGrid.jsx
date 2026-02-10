import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import './CharacterGrid.css'; // Reusing styles

const StarWarsGrid = () => {
  const navigate = useNavigate();
  
  // Mock data
  const characters = [
    { id: 1, name: 'Luke Skywalker', image: 'https://starwars-visualguide.com/assets/img/characters/1.jpg', faction: 'Jedi' },
    { id: 2, name: 'Darth Vader', image: 'https://starwars-visualguide.com/assets/img/characters/4.jpg', faction: 'Sith' },
    { id: 3, name: 'Leia Organa', image: 'https://starwars-visualguide.com/assets/img/characters/5.jpg', faction: 'Rebel' },
    { id: 4, name: 'Han Solo', image: 'https://starwars-visualguide.com/assets/img/characters/14.jpg', faction: 'Rebel' },
    { id: 5, name: 'Yoda', image: 'https://starwars-visualguide.com/assets/img/characters/20.jpg', faction: 'Jedi' },
  ];

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #000000 0%, #1a1a1a 100%)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/starwars.webp" alt="Star Wars" />
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
            <div key={char.id} className="character-card" style={{ "--border-color": "#fbbf24" }}>
              <div className="card-glow"></div>
              <div className="card-id">#{char.id}</div>
              <div className="card-image-container">
                <img src={char.image} alt={char.name} className="card-image" />
              </div>
              <div className="card-info">
                <h3 className="card-name">{char.name}</h3>
                <div className="card-badges">
                  <span className="badge" style={{ backgroundColor: "#fbbf24" }}>{char.faction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StarWarsGrid;
