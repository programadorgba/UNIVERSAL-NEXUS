import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LOTRCharacterGrid from '../pages/LOTRCharacterGrid.jsx';
import LOTRCharacterDetail from '../pages/LOTRCharacterDetail.jsx';

const LOTRView = () => {
  return (
    <Routes>
      <Route path="/" element={<LOTRCharacterGrid />} />
      <Route path="/character/:id" element={<LOTRCharacterDetail />} />
    </Routes>
  );
};

export default LOTRView;
