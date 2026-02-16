import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Shield } from 'lucide-react'
import { lotrAPI } from '../services/api'
import './CharacterGrid.css'

// Placeholder icons (using ones that fit the theme)
import iconTodos from '../assets/SUPERapi/todos.png'
import iconRing from '../assets/SUPERapi/Gemini_Generated_Image_3fmkaf3fmkaf3fmk.png' // Using as ring placeholder

const LOTRCharacterGrid = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [filteredCharacters, setFilteredCharacters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [hasMore, setHasMore] = useState(false)

  const categories = [
    { id: 'all', icon: iconTodos, label: 'Todos' },
    { id: 'fellowship', icon: iconRing, label: 'La Comunidad' }
  ]

  const loadCharacters = useCallback(async (isInitial = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await lotrAPI.getPeople()
      
      if (isInitial) {
        setCharacters(data.results)
        setFilteredCharacters(data.results)
      } else {
        setCharacters(prev => [...prev, ...data.results])
        setFilteredCharacters(prev => [...prev, ...data.results])
      }
      
      setHasMore(data.hasMore)
    } catch (err) {
      console.error('Error loading LOTR characters:', err)
      setError('Error al cargar personajes de la Tierra Media')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCharacters(true)
  }, [loadCharacters])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setFilteredCharacters(characters)
      return
    }

    const filtered = characters.filter(char => 
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.race.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCharacters(filtered)
  }

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId)
    if (categoryId === 'all') {
      setFilteredCharacters(characters)
    } else {
      // For mock purposes, just a subset or same
      setFilteredCharacters(characters.slice(0, 5))
    }
  }

  const handleCharacterClick = (id) => {
    navigate(`/lotr/character/${id}`)
  }

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)' }}>
      <aside className="sidebar" style={{ borderRightColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div className="sidebar-logo" onClick={() => navigate("/")} style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.2), transparent 70%)' }}>
           <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>LOTR</div>
        </div>

        <div className="sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => filterByCategory(category.id)}
              style={activeCategory === category.id ? { 
                borderColor: '#10b981', 
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                background: 'radial-gradient(circle at left, rgba(16, 185, 129, 0.4), rgba(15, 23, 42, 0.95))'
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
              placeholder="Buscar en la Tierra Media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
              <Search size={20} />
              Buscar
            </button>
          </form>
        </header>

        {error && <div className="error-message" style={{ borderLeft: '4px solid #10b981' }}>{error}</div>}
        
        <div className="characters-grid">
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              className="character-card"
              style={{ '--border-color': '#10b981' }}
              onClick={() => handleCharacterClick(char.id)}
            >
              <div className="card-glow"></div>
              <div className="card-id">#{char.id.slice(-4)}</div>

              <div className="card-image-container" style={{ background: 'radial-gradient(circle at top, #10b981, #000)' }}>
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
                    style={{ backgroundColor: '#10b981', color: '#fff' }}
                  >
                    {char.race}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner" style={{ borderTopColor: '#10b981' }}></div>
          </div>
        )}

        {!loading && hasMore && filteredCharacters.length > 0 && activeCategory === 'all' && !searchTerm && (
          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={() => loadCharacters()}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', borderColor: '#10b981' }}
            >
              Cargar más personajes
            </button>
          </div>
        )}

        {!loading && filteredCharacters.length === 0 && !error && (
          <div className="empty-state">
            <p>No se encontraron rastros en estas tierras</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default LOTRCharacterGrid
