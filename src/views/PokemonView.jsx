import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PokemonGrid from '../pages/PokemonGrid.jsx';

const PokemonView = () => {
  return (
    <Routes>
      <Route path="/" element={<PokemonGrid />} />
    </Routes>
  );
};

export default PokemonView;
