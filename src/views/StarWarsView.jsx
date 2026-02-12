import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StarwarsCharacterGrid from '../pages/StarwarsCharacterGrid.jsx';
import StarwarsCharacterDetail from '../pages/StarwarsCharacterDetail.jsx';

const StarWarsView = () => {
  return (
    <Routes>
      <Route path="/" element={<StarwarsCharacterGrid />} />
      <Route path="/character/:id" element={<StarwarsCharacterDetail />} />
    </Routes>
  );
};

export default StarWarsView;
