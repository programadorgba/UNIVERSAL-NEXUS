import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LOTRGrid from '../pages/LOTRGrid.jsx';

const LOTRView = () => {
  return (
    <Routes>
      <Route path="/" element={<LOTRGrid />} />
    </Routes>
  );
};

export default LOTRView;
