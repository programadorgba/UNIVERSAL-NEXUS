import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { pokemonAPI } from '../services/api'
import './CharacterGrid.css'
import AppLoader from '../components/AppLoader'

// Importar iconos de categorías
import iconTodos from '../assets/SUPERapi/todos.png'
import iconBayas from '../assets/SUPERapi/bayas.png'
import iconConcursos from '../assets/SUPERapi/concursos.png'
import iconEncuentros from '../assets/SUPERapi/encuentros.png'
import iconEvolucion from '../assets/SUPERapi/evolucion.png'
import iconItems from '../assets/SUPERapi/items.png'
import iconJuegos from '../assets/SUPERapi/juegos.png'
import iconMachines from '../assets/SUPERapi/machines.png'
import iconMovies from '../assets/SUPERapi/movies.png'
import iconUbicacion from '../assets/SUPERapi/ubicacion.png'

const PokemonCharacterGrid = () => {
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState([])
  const [filteredPokemon, setFilteredPokemon] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', icon: iconTodos, label: 'Todos' },
    { id: 'fire', icon: iconBayas, label: 'Fuego' },
    { id: 'water', icon: iconConcursos, label: 'Agua' },
    { id: 'grass', icon: iconEncuentros, label: 'Planta' },
    { id: 'electric', icon: iconEvolucion, label: 'Eléctrico' },
    { id: 'psychic', icon: iconItems, label: 'Psíquico' },
    { id: 'dragon', icon: iconJuegos, label: 'Dragón' },
    { id: 'normal', icon: iconMachines, label: 'Normal' },
    { id: 'fighting', icon: iconMovies, label: 'Lucha' },
    { id: 'flying', icon: iconUbicacion, label: 'Volador' }
  ]

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadPokemon = useCallback(async (pageNum = page, isInitial = false) => {
    if (loading && !isInitial) return
    
    setLoading(true)
    setError(null)
    try {
      const perPage = 20
      const data = await pokemonAPI.getAll(pageNum, perPage)
      
      if (data.length < perPage) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      if (isInitial) {
        setPokemon(data)
        setFilteredPokemon(data)
      } else {
        setPokemon(prev => [...prev, ...data])
        setFilteredPokemon(prev => [...prev, ...data])
      }
      
      setPage(pageNum + 1)
    } catch (err) {
      console.error('Error loading Pokemon:', err)
      setError('Error al cargar Pokemon')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadPokemon(1, true)
  }, [loadPokemon])

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setFilteredPokemon(pokemon)
      return
    }

    setLoading(true)
    setError(null)
    setHasMore(false) // Disable load more during search result view

    try {
      const result = await pokemonAPI.searchByName(searchTerm)
      if (result.results && result.results.length > 0) {
        setFilteredPokemon(result.results)
        setError(null)
      } else {
        setFilteredPokemon([])
        setError('No se encontraron Pokemon')
      }
    } catch (err) {
      console.error('Error searching Pokemon:', err)
      setError('Error al buscar Pokemon')
      setFilteredPokemon([])
    } finally {
      setLoading(false)
    }
  }

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setHasMore(false) // Disable load more during category filtering

    if (categoryId === 'all') {
      setFilteredPokemon(pokemon)
      setHasMore(true)
      return
    }

    const filtered = pokemon.filter((p) =>
      p.types?.some(type => type.toLowerCase() === categoryId.toLowerCase())
    )

    setFilteredPokemon(filtered)
  }

  const getTypeColor = (types) => {
    if (!types || types.length === 0) return '#64748b'
    
    const typeColors = {
      fire: '#f97316',
      water: '#3b82f6',
      grass: '#22c55e',
      electric: '#eab308',
      psychic: '#a855f7',
      dragon: '#8b5cf6',
      normal: '#94a3b8',
      fighting: '#dc2626',
      flying: '#06b6d4',
      poison: '#9333ea',
      ground: '#d97706',
      rock: '#78716c',
      bug: '#84cc16',
      ghost: '#6366f1',
      steel: '#71717a',
      ice: '#0ea5e9',
      dark: '#1f2937',
      fairy: '#ec4899'
    }

    return typeColors[types[0].toLowerCase()] || '#ef4444'
  }

  const handlePokemonClick = (pokemonId) => {
    navigate(`/pokemon/character/${pokemonId}`)
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #200505 0%, #000000 100%)' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/")}>
          <img src="/src/assets/icons/pokemon.webp" alt="Pokemon" />
        </div>

        <div className="sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
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
              placeholder="Buscar Pokémon..."
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
        
        <div className="characters-grid">
          {filteredPokemon.map((p, index) => {
            const borderColor = getTypeColor(p.types)

            return (
              <div
                key={p.id || index}
                className="character-card"
                style={{ '--border-color': borderColor }}
                onClick={() => handlePokemonClick(p.id)}
              >
                <div className="card-glow"></div>
                <div className="card-id">#{p.id}</div>

                <div className="card-image-container">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-image"
                    onError={(e) => {
                      console.log('Error loading image for', p.name, ':', e)
                    }}
                  />
                </div>

                <div className="card-info">
                  <h3 className="card-name">{capitalize(p.name)}</h3>

                  <div className="card-badges">
                    {p.types && p.types.map((type, i) => (
                      <span
                        key={i}
                        className="badge"
                        style={{ backgroundColor: getTypeColor([type]) }}
                      >
                        {capitalize(type)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
        {loading && (
          <AppLoader 
            color="#7c3aed" 
            label="Cargando Mundo Mágico" 
            messages={[
              "Agitando varitas...",
              "Preparando pociones...",
              "Consultando al Sombrero Seleccionador...",
              "Enviando lechuzas..."
            ]} 
          />
        )}
        {!loading && hasMore && filteredPokemon.length > 0 && activeCategory === 'all' && !searchTerm && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={() => loadPokemon()}>
              Cargar más Pokémon
            </button>
          </div>
        )}

        {!loading && filteredPokemon.length === 0 && !error && (
          <div className="empty-state">
            <p>No se encontraron Pokemon</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default PokemonCharacterGrid
