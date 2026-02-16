import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DragonBallCharacterGrid from '../pages/DragonBallCharacterGrid.jsx';
import DragonBallCharacterDetail from '../pages/DragonBallCharacterDetail.jsx';

const DragonBallView = () => {
  return (
    <Routes>
      <Route path="/" element={<DragonBallCharacterGrid />} />
      <Route path="/character/:id" element={<DragonBallCharacterDetail />} />
    </Routes>
  );
};

export default DragonBallView;
