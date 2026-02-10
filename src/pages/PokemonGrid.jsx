import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import './CharacterGrid.css';

const PokemonGrid = () => {
  const navigate = useNavigate();
  
  const characters = [
    { id: 25, name: 'Pikachu', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', type: 'Electric' },
    { id: 6, name: 'Charizard', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', type: 'Fire' },
    { id: 1, name: 'Bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', type: 'Grass' },
    { id: 150, name: 'Mewtwo', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png', type: 'Psychic' },
  ];

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #200505 0%, #000000 100%)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/pokemon.webp" alt="Pokemon" />
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
            <div key={char.id} className="character-card" style={{ "--border-color": "#ef4444" }}>
              <div className="card-glow"></div>
              <div className="card-id">#{char.id}</div>
              <div className="card-image-container">
                <img src={char.image} alt={char.name} className="card-image" />
              </div>
              <div className="card-info">
                <h3 className="card-name">{char.name}</h3>
                <div className="card-badges">
                  <span className="badge" style={{ backgroundColor: "#ef4444" }}>{char.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PokemonGrid;
