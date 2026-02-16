import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HarryCharacterGrid from '../pages/HarryCharacterGrid.jsx'
import HarryCharacterDetail from '../pages/HarryCharacterDetail.jsx'

const HarryPotterView = () => {
  return (
    <Routes>
      <Route path="/" element={<HarryCharacterGrid />} />
      <Route path="/character/:id" element={<HarryCharacterDetail />} />
    </Routes>
  )
}

export default HarryPotterView

