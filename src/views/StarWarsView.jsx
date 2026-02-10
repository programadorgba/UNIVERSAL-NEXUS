import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StarWarsGrid from '../pages/StarWarsGrid.jsx';

const StarWarsView = () => {
  return (
    <Routes>
      <Route path="/" element={<StarWarsGrid />} />
    </Routes>
  );
};

export default StarWarsView;
