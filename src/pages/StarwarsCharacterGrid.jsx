import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Star } from "lucide-react";
import { starWarsAPI } from "../services/api";
import "./CharacterGrid.css";

// Iconos (proporcionados)
import iconFilms from "../assets/SUPERapi/films.png";
import iconPeople from "../assets/SUPERapi/people.png";
import iconPlanets from "../assets/SUPERapi/planets.png";
import iconSpecies from "../assets/SUPERapi/especies.png";
import iconShips from "../assets/SUPERapi/starchips.png";
import iconVehicles from "../assets/SUPERapi/vehicles.png";

const StarwarsCharacterGrid = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("people");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { id: "films", icon: iconFilms, label: "Films" },
    { id: "people", icon: iconPeople, label: "People" },
    { id: "planets", icon: iconPlanets, label: "Planets" },
    { id: "species", icon: iconSpecies, label: "Species" },
    { id: "starships", icon: iconShips, label: "Starships" },
    { id: "vehicles", icon: iconVehicles, label: "Vehicles" },
  ];

  const loadCharacters = useCallback(
    async (pageNum, isInitial = false) => {
      if (loading && !isInitial) return;

      setLoading(true);
      setError(null);
      try {
        let data;
        switch (activeCategory) {
          case "planets":
            data = await starWarsAPI.getPlanets(pageNum);
            break;
          case "starships":
            data = await starWarsAPI.getStarships(pageNum);
            break;
          case "vehicles":
            data = await starWarsAPI.getVehicles(pageNum);
            break;
          case "species":
            data = await starWarsAPI.getSpecies(pageNum);
            break;
          case "films":
            data = await starWarsAPI.getFilms(pageNum);
            break;
          default:
            data = await starWarsAPI.getPeople(pageNum);
        }

        setHasMore(data.hasMore);

        if (isInitial) {
          setCharacters(data.results);
          setFilteredCharacters(data.results);
        } else {
          setCharacters((prev) => [...prev, ...data.results]);
          setFilteredCharacters((prev) => [...prev, ...data.results]);
        }

        setPage(pageNum + 1);
      } catch (err) {
        console.error("Error loading Star Wars data:", err);
        setError("Error al cargar datos de la galaxia");
      } finally {
        setLoading(false);
      }
    },
    [loading, activeCategory],
  );

useEffect(() => {
  setCharacters([])
  setFilteredCharacters([])
  setPage(1)
  setHasMore(true)
  loadCharacters(1, true)
}, [activeCategory])  

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setFilteredCharacters(characters);
      setHasMore(characters.length >= 10);
      return;
    }

    setLoading(true);
    setError(null);
    setHasMore(false);

    try {
      // Búsqueda solo disponible para People en esta versión
      if (activeCategory === "people" || activeCategory === "all") {
        const result = await starWarsAPI.searchPeople(searchTerm);
        if (result.results && result.results.length > 0) {
          setFilteredCharacters(result.results);
        } else {
          setFilteredCharacters([]);
          setError("No se encontraron resultados");
        }
      } else {
        // Filtrado local para otras categorías
        const filtered = characters.filter((item) =>
          (item.name || item.title || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        );
        setFilteredCharacters(filtered);
      }
    } catch (err) {
      console.error("Error searching Star Wars data:", err);
      setError("Error al buscar");
      setFilteredCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCharacterClick = (id) => {
    navigate(`/starwars/character/${id}`);
  };

  return (
    <div
      className="character-grid-page"
      style={{
        background: "radial-gradient(circle at top, #000000 0%, #1a1a1a 100%)",
      }}
    >
      <aside
        className="sidebar"
        style={{ borderRightColor: "rgba(251, 191, 36, 0.3)" }}
      >
        <div
          className="sidebar-logo"
          onClick={() => navigate("/")}
          style={{
            borderColor: "rgba(251, 191, 36, 0.4)",
            background:
              "radial-gradient(circle at top, rgba(251, 191, 36, 0.2), transparent 70%)",
          }}
        >
          <img src="/src/assets/icons/starwars.webp" alt="Star Wars" />
        </div>

        <div className="sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => filterByCategory(category.id)}
              style={
                activeCategory === category.id
                  ? {
                      borderColor: "#fbbf24",
                      boxShadow: "0 0 25px rgba(251, 191, 36, 0.4)",
                      background:
                        "radial-gradient(circle at left, rgba(251, 191, 36, 0.4), rgba(15, 23, 42, 0.95))",
                    }
                  : {}
              }
              title={category.label}
            >
              <img
                src={category.icon}
                alt={category.label}
                className="category-icon"
              />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <header className="grid-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
            Volver
          </button>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar en la galaxia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="search-btn"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                color: "#000",
              }}
            >
              <Search size={20} />
              Buscar
            </button>
          </form>
        </header>

        {error && (
          <div
            className="error-message"
            style={{ borderLeft: "4px solid #fbbf24" }}
          >
            {error}
          </div>
        )}

        <div className="characters-grid">
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              className="character-card"
              style={{ "--border-color": "#fbbf24" }}
              onClick={() => handleCharacterClick(char.id)}
            >
              <div className="card-glow"></div>
              <div className="card-id">#{char.id}</div>

              <div
                className="card-image-container"
                style={{
                  background: "radial-gradient(circle at top, #fbbf24, #000)",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name || char.title}
                  className="card-image"
                  onError={(e) => {
                    // Prevenir loops infinitos
                    if (e.target.dataset.errorHandled) return;
                    e.target.dataset.errorHandled = "true";

                    const name = char.name || char.title || "Unknown";

                    // Fallback a UI Avatars si jsDelivr falla
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=fbbf24&color=000&font-size=0.4&bold=true`;
                  }}
                />
              </div>

              <div className="card-info">
                <h3 className="card-name">{char.name || char.title}</h3>
                <div className="card-badges">
                  <span
                    className="badge"
                    style={{ backgroundColor: "#fbbf24", color: "#000" }}
                  >
                    {activeCategory === "people"
                      ? char.gender === "n/a"
                        ? "Droid"
                        : char.gender
                      : activeCategory === "planets"
                        ? char.terrain
                        : activeCategory === "films"
                          ? `Episodio ${char.episode_id}`
                          : activeCategory}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading">
            <div
              className="spinner"
              style={{ borderTopColor: "#fbbf24" }}
            ></div>
          </div>
        )}

        {!loading &&
          hasMore &&
          filteredCharacters.length > 0 &&
          activeCategory === "people" &&
          !searchTerm && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => loadCharacters(page)}
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                  color: "#000",
                  borderColor: "#fbbf24",
                }}
              >
                Explorar más la galaxia
              </button>
            </div>
          )}

        {!loading && filteredCharacters.length === 0 && !error && (
          <div className="empty-state">
            <p>No se encontraron resultados en estos sistemas</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StarwarsCharacterGrid;
