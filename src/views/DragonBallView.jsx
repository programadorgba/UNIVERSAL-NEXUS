import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DragonBallGrid from '../pages/DragonBallGrid.jsx';

const DragonBallView = () => {
  return (
    <Routes>
      <Route path="/" element={<DragonBallGrid />} />
    </Routes>
  );
};

export default DragonBallView;
