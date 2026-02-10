import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/icons/logo.webp';
import './Home.css'; 

const universes = [
  { id: "starwars", name: "Star Wars", icon: "starwars", color: "#E1B311", tagline: "Una galaxia muy, muy lejana" },
  { id: "harrypotter", name: "Harry Potter", icon: "harrypotter", color: "#740001", tagline: "El mundo mágico de Hogwarts" },
  { id: "superhero", name: "Superhéroes", icon: "superhero", color: "#0052CC", tagline: "Marvel, DC y más" },
  { id: "dragonball", name: "Dragon Ball", icon: "dragonball", color: "#FF8C00", tagline: "Los guerreros más poderosos" },
  { id: "pokemon", name: "Pokémon", icon: "pokemon", color: "#FF0000", tagline: "Atrápalos a todos" },
  { id: "lotr", name: "El Señor de los Anillos", icon: "lotr", color: "#2E8B57", tagline: "La Tierra Media te espera" },
];

const Home = () => {
  const navigate = useNavigate();

  // Función equivalente a getImageUrl en Vue
const getImageUrl = (name) => {
  return new URL(`../assets/icons/${name}.webp`, import.meta.url).href;
};

  const selectUniverse = (universeId) => {
    // Aquí podrías disparar una acción de Redux/Zustand si decides usarlos después
    navigate(`/${universeId}`);
  };

  return (
    <div className="home">
      <h1 className="title title-inline">
        <img src={logo} alt="Logo" className="title-logo" />
        <span>Elige tu Universo</span>
      </h1>

      <p className="subtitle">
        Explora personajes, mundos y maquinas de tus sagas favoritas
      </p>

      <div className="grid">
        {universes.map((universe) => (
          <div
            key={universe.id}
            className="card"
            style={{ '--card-color': universe.color }}
            onClick={() => selectUniverse(universe.id)}
          >
            <div className="icon">
              <img
                src={getImageUrl(universe.icon)}
                alt={universe.name}
                className="universe-image"
              />
            </div>
            <h2>{universe.name}</h2>
            <p className="tagline">{universe.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;