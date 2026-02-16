import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PokemonCharacterGrid from '../pages/PokemonCharacterGrid.jsx';
import PokemonCharacterDetail from '../pages/PokemonCharacterDetail.jsx'; 

const PokemonView = () => {
  return (
    <Routes>
      <Route path="/" element={<PokemonCharacterGrid />} />
            <Route path="/character/:id" element={<PokemonCharacterDetail />} />

    </Routes>
  );
};

export default PokemonView;
