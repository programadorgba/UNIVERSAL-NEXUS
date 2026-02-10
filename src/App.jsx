import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import SuperheroView from './views/SuperheroView';
import HarryPotterView from './views/HarryPotterView';
import StarWarsView from './views/StarWarsView';
import DragonBallView from './views/DragonBallView';
import PokemonView from './views/PokemonView';
import LOTRView from './views/LOTRView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/superhero/*" element={<SuperheroView />} />
        <Route path="/harrypotter/*" element={<HarryPotterView />} />
        <Route path="/starwars/*" element={<StarWarsView />} />
        <Route path="/dragonball/*" element={<DragonBallView />} />
        <Route path="/pokemon/*" element={<PokemonView />} />
        <Route path="/lotr/*" element={<LOTRView />} />
        <Route path="*" element={<div style={{color: 'white'}}>404 - Universo no encontrado</div>} />
      </Routes>
    </Router>
  );
}

export default App;
