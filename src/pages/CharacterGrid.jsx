import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Zap } from "lucide-react";
import { superheroAPI } from "../services/api";
import "./CharacterGrid.css";

// Importar iconos de categorías
import iconTodos from "../assets/SUPERapi/todos.png";
import iconHeroes from "../assets/SUPERapi/heroes.png";
import iconVillanos from "../assets/SUPERapi/villanos.png";
import iconMarvel from "../assets/SUPERapi/marvel.png";
import iconDC from "../assets/SUPERapi/dc.png";
import iconPopular from "../assets/SUPERapi/Gemini_Generated_Image_3fmkaf3fmkaf3fmk.png";

const CharacterGrid = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", icon: iconTodos, label: "Todos" },
    { id: "heroes", icon: iconHeroes, label: "Héroes" },
    { id: "villains", icon: iconVillanos, label: "Villanos" },
    { id: "marvel", icon: iconMarvel, label: "Marvel" },
    { id: "dc", icon: iconDC, label: "DC" },
    { id: "popular", icon: iconPopular, label: "Populares" },
  ];

  const [hasMore, setHasMore] = useState(true);
  const [allPopularCharacters, setAllPopularCharacters] = useState([]);

  const loadPopularCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const popularNames = [
        "Batman", "Superman", "Wonder Woman", "The Flash", "Aquaman",
        "Green Lantern", "Joker", "Harley Quinn", "Cyborg", "Spider-Man",
        "Iron Man", "Hulk", "Thor", "Captain America", "Black Widow",
        "Black Panther", "Doctor Strange", "Wolverine", "Magneto", "Venom",
        "Groot", "Rocket Raccoon", "Star-Lord", "Gamora", "Drax", "Daredevil",
        "Punisher", "Deadpool", "Storm", "Cyclops", "Jean Grey", "Beast",
        "Professor X", "Silver Surfer", "Ghos Rider", "Blade", "Spawn", "Hellboy"
      ];

      const promises = popularNames.map(async (name) => {
        try {
          const result = await superheroAPI.searchByName(name);
          return result.results ? result.results[0] : null;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validCharacters = results.filter((char) => char !== null);
      
      // Eliminar duplicados si los hay (por ID)
      const uniqueCharacters = Array.from(new Map(validCharacters.map(item => [item.id, item])).values());

      setAllPopularCharacters(uniqueCharacters);
      // Mostrar los primeros 20
      setCharacters(uniqueCharacters.slice(0, 20));
      setFilteredCharacters(uniqueCharacters.slice(0, 20));
      setHasMore(uniqueCharacters.length > 20);
    } catch (err) {
      console.error("Error loading characters:", err);
      setError("Error al cargar personajes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularCharacters();
  }, [loadPopularCharacters]);

  const loadMoreCharacters = () => {
    const nextLimit = characters.length + 20;
    const nextBatch = allPopularCharacters.slice(0, nextLimit);
    setCharacters(nextBatch);
    setFilteredCharacters(nextBatch);
    setHasMore(allPopularCharacters.length > nextLimit);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setFilteredCharacters(characters);
      return;
    }

    setLoading(true);
    setError(null);
    setHasMore(false);

    try {
      const result = await superheroAPI.searchByName(searchTerm);
      console.log("Search result for", searchTerm, ":", result);
      if (result.results && result.results.length > 0) {
        setFilteredCharacters(result.results);
        setError(null);
      } else {
        setFilteredCharacters([]);
        setError("No se encontraron personajes");
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError("Error al buscar personajes");
      setFilteredCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);

    if (categoryId === "all") {
      setFilteredCharacters(characters);
      return;
    }

    let filtered = characters;

    switch (categoryId) {
      case "heroes":
        filtered = characters.filter((char) => char.alignment === "good");
        setHasMore(false);
        break;
      case "villains":
        filtered = characters.filter((char) => char.alignment === "bad");
        setHasMore(false);
        break;
      case "marvel":
        filtered = characters.filter((char) =>
          char.publisher?.toLowerCase().includes("marvel"),
        );
        setHasMore(false);
        break;
      case "dc":
        filtered = characters.filter((char) =>
          char.publisher?.toLowerCase().includes("dc"),
        );
        setHasMore(false);
        break;
      case "popular":
        filtered = characters.slice(0, 10);
        setHasMore(false);
        break;
      default:
        filtered = characters;
        setHasMore(allPopularCharacters.length > characters.length);
    }

    setFilteredCharacters(filtered);
  };

  const getCardBorderColor = (character) => {
    const publisher = character.publisher?.toLowerCase() || "";
    if (publisher.includes("marvel")) return "#ed1d24";
    if (publisher.includes("dc")) return "#0074e8";
    return "#64748b";
  };

  const getAlignmentColor = (alignment) => {
    if (alignment === "good") return "#10b981";
    if (alignment === "bad") return "#7c3aed";
    return "#64748b";
  };

  const getPublisherBadge = (publisher) => {
    const pub = publisher?.toLowerCase() || "";
    if (pub.includes("marvel")) return { text: "Marvel", color: "#ed1d24" };
    if (pub.includes("dc")) return { text: "DC Comics", color: "#0074e8" };
    return { text: publisher || "Unknown", color: "#64748b" };
  };

  const handleCharacterClick = (characterId) => {
    navigate(`/superhero/character/${characterId}`);
  };

  return (
    <div className="character-grid-page">
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/superhero.webp" alt="Superhéroes" />
        </div>

        <div className="sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => filterByCategory(category.id)}
              title={category.label}
            >
              <img
                src={category.icon}
                alt={category.label}
                className="category-icon"
              />
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
              placeholder="Buscar superhéroe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={20} />
              Buscar
            </button>
          </form>
        </header>

        {error && <div className="error-message">{error}</div>}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && filteredCharacters.length > 0 && (
          <div className="characters-grid">
            {filteredCharacters.map((character, index) => {
              const borderColor = getCardBorderColor(character);
              const alignmentColor = getAlignmentColor(character.alignment);
              const publisherBadge = getPublisherBadge(character.publisher);

              return (
                <div
                  key={character.id || index}
                  className="character-card"
                  style={{ "--border-color": borderColor }}
                  onClick={() => handleCharacterClick(character.id)}
                >
                  <div className="card-glow"></div>
                  <div className="card-id">#{character.id}</div>

                  <div className="card-image-container">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="card-image"
                      onError={(e) => {
                        console.log(
                          "Error loading image for",
                          character.name,
                          ":",
                          e,
                        );
                      }}
                    />
                  </div>

                  <div className="card-info">
                    <h3 className="card-name">{character.name}</h3>

                    <div className="card-badges">
                      <span
                        className="badge badge-publisher"
                        style={{ backgroundColor: publisherBadge.color }}
                      >
                        {publisherBadge.text}
                      </span>
                      {character.alignment && (
                        <span
                          className="badge badge-alignment"
                          style={{ backgroundColor: alignmentColor }}
                        >
                          {character.alignment === "good" ? "Héroe" : "Villano"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && hasMore && filteredCharacters.length > 0 && activeCategory === "all" && !searchTerm && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={loadMoreCharacters}>
              Cargar más superhéroes
            </button>
          </div>
        )}

        {!loading && filteredCharacters.length === 0 && !error && (
          <div className="empty-state">
            <p>No se encontraron personajes</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CharacterGrid;
