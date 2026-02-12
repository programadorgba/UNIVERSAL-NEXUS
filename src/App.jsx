import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Carga perezosa (Lazy Loading) de las vistas para optimizar el rendimiento inicial
const Home = lazy(() => import("./views/Home"));
const SuperheroView = lazy(() => import("./views/SuperheroView"));
const HarryPotterView = lazy(() => import("./views/HarryPotterView"));
const StarWarsView = lazy(() => import("./views/StarWarsView"));
const DragonBallView = lazy(() => import("./views/DragonBallView"));
const PokemonView = lazy(() => import("./views/PokemonView"));
const LOTRView = lazy(() => import("./views/LOTRView"));

// Componente de carga simple pero elegante
const LoadingSpinner = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#020617",
      color: "white",
      fontSize: "1.2rem",
      fontFamily: "system-ui",
    }}
  >
    Cargando Universo...
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/superhero/*" element={<SuperheroView />} />
          <Route path="/harrypotter/*" element={<HarryPotterView />} />
          <Route path="/starwars/*" element={<StarWarsView />} />
          <Route path="/dragonball/*" element={<DragonBallView />} />
          <Route path="/pokemon/*" element={<PokemonView />} />
          <Route path="/lotr/*" element={<LOTRView />} />
          <Route
            path="*"
            element={
              <div style={{ color: "white" }}>404 - Universo no encontrado</div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
