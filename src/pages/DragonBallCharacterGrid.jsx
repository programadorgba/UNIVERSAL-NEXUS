import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { dragonBallAPI } from '../services/api'
import './CharacterGrid.css'

// Iconos (usando logos de DB o placeholders por ahora)
import iconTodos from '../assets/SUPERapi/todos.png'
import iconSaiyan from '../assets/SUPERapi/Gemini_Generated_Image_3fmkaf3fmkaf3fmk.png' // Usando popular como Saiyan

const DragonBallCharacterGrid = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [filteredCharacters, setFilteredCharacters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', icon: iconTodos, label: 'Todos' },
    { id: 'Saiyan', icon: iconSaiyan, label: 'Saiyan' },
    { id: 'Namekian', icon: iconSaiyan, label: 'Namekiano' },
    { id: 'Human', icon: iconSaiyan, label: 'Humano' },
    { id: 'Frieza Race', icon: iconSaiyan, label: 'Frieza Race' },
    { id: 'Android', icon: iconSaiyan, label: 'Androide' }
  ]

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadCharacters = useCallback(async (pageNum = page, isInitial = false) => {
    if (loading && !isInitial) return
    
    setLoading(true)
    setError(null)
    try {
      const perPage = 20
      const data = await dragonBallAPI.getAll(pageNum, perPage)
      
      if (data.length < perPage) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      if (isInitial) {
        setCharacters(data)
        setFilteredCharacters(data)
      } else {
        setCharacters(prev => [...prev, ...data])
        setFilteredCharacters(prev => [...prev, ...data])
      }
      
      setPage(pageNum + 1)
    } catch (err) {
      console.error('Error loading DB characters:', err)
      setError('Error al cargar personajes de Dragon Ball')
    } finally {
      setLoading(false)
    }
  }, [page, loading])

  useEffect(() => {
    loadCharacters(1, true)
  }, [loadCharacters])

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setFilteredCharacters(characters)
      return
    }

    setLoading(true)
    setError(null)
    setHasMore(false)

    try {
      const result = await dragonBallAPI.searchByName(searchTerm)
      if (result.results && result.results.length > 0) {
        setFilteredCharacters(result.results)
      } else {
        setFilteredCharacters([])
        setError('No se encontraron personajes')
      }
    } catch (err) {
      console.error('Error searching DB characters:', err)
      setError('Error al buscar personajes')
      setFilteredCharacters([])
    } finally {
      setLoading(false)
    }
  }

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setHasMore(false)

    if (categoryId === 'all') {
      setFilteredCharacters(characters)
      setHasMore(true)
      return
    }

    const filtered = characters.filter((char) =>
      char.race?.toLowerCase().includes(categoryId.toLowerCase())
    )

    setFilteredCharacters(filtered)
  }

  const getRaceColor = (race) => {
    if (!race) return '#f97316' // Orange for DB
    const lowerRace = race.toLowerCase()
    if (lowerRace.includes('saiyan')) return '#facc15' // Yellow
    if (lowerRace.includes('namekian')) return '#22c55e' // Green
    if (lowerRace.includes('frieza')) return '#a855f7' // Purple
    if (lowerRace.includes('human')) return '#3b82f6' // Blue
    if (lowerRace.includes('android')) return '#ef4444' // Red
    return '#f97316'
  }

  const handleCharacterClick = (id) => {
    navigate(`/dragonball/character/${id}`)
  }

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #1a0b00 0%, #000000 100%)' }}>
      <aside className="sidebar" style={{ borderRightColor: 'rgba(249, 115, 22, 0.3)' }}>
        <div className="sidebar-logo" onClick={() => navigate("/")} style={{ borderColor: 'rgba(249, 115, 22, 0.4)', background: 'radial-gradient(circle at top, rgba(249, 115, 22, 0.2), transparent 70%)' }}>
          <img src="/src/assets/icons/dragonball.webp" alt="Dragon Ball" />
        </div>

        <div className="sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => filterByCategory(category.id)}
              style={activeCategory === category.id ? { 
                borderColor: '#f97316', 
                boxShadow: '0 0 25px rgba(249, 115, 22, 0.4)',
                background: 'radial-gradient(circle at left, rgba(249, 115, 22, 0.4), rgba(15, 23, 42, 0.95))'
              } : {}}
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
              placeholder="Buscar personaje de Dragon Ball..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 40%, #c2410c 100%)', boxShadow: '0 10px 25px rgba(234, 88, 12, 0.4)' }}>
              <Search size={20} />
              Buscar
            </button>
          </form>
        </header>

        {error && <div className="error-message" style={{ borderLeft: '4px solid #f97316' }}>{error}</div>}
        
        <div className="characters-grid">
          {filteredCharacters.map((char) => {
            const raceColor = getRaceColor(char.race)

            return (
              <div
                key={char.id}
                className="character-card"
                style={{ '--border-color': raceColor }}
                onClick={() => handleCharacterClick(char.id)}
              >
                <div className="card-glow"></div>
                <div className="card-id">#{char.id}</div>

                <div className="card-image-container" style={{ background: `radial-gradient(circle at top, ${raceColor}, rgba(15, 23, 42, 0.9))` }}>
                  <img
                    src={char.image}
                    alt={char.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=' + char.name
                    }}
                  />
                </div>

                <div className="card-info">
                  <h3 className="card-name">{char.name}</h3>
                  <div className="card-badges">
                    <span
                      className="badge"
                      style={{ backgroundColor: raceColor }}
                    >
                      {char.race}
                    </span>
                    <span
                      className="badge"
                      style={{ backgroundColor: '#475569' }}
                    >
                      Ki: {char.ki}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner" style={{ borderTopColor: '#f97316' }}></div>
          </div>
        )}

        {!loading && hasMore && filteredCharacters.length > 0 && activeCategory === 'all' && !searchTerm && (
          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={() => loadCharacters()}
              style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', borderColor: 'rgba(249, 115, 22, 0.4)' }}
            >
              Cargar más personajes
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
  )
}

export default DragonBallCharacterGrid
