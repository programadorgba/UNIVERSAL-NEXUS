import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CharacterGrid from '../pages/CharacterGrid.jsx';
import CharacterDetail from '../pages/CharacterDetail.jsx';

const SuperheroView = () => {
  return (
    <Routes>
      <Route path="/" element={<CharacterGrid />} />
      <Route path="/character/:id" element={<CharacterDetail />} />
    </Routes>
  );
};

export default SuperheroView;