import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Shield } from 'lucide-react'
import { lotrAPI } from '../services/api'
import './CharacterGrid.css'

// Placeholder icons (using ones that fit the theme)
import Personajes from '../assets/SUPERapi/lort-personajes.png'
import Libros from '../assets/SUPERapi/lort-libros.png'
import Mundos from '../assets/SUPERapi/lort-mundos.png'
import Capitulos from '../assets/SUPERapi/lort-capitulos.png'
import Peliculas from '../assets/SUPERapi/lort-peliculas.png'

const LOTRCharacterGrid = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Personajes')
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const categories = [
    { id: 'Personajes', icon: Personajes, label: 'Personajes' },
    { id: 'Libros', icon: Libros, label: 'Libros' },
    { id: 'Mundos', icon: Mundos, label: 'Mundos' },
    { id: 'Peliculas', icon: Peliculas, label: 'Peliculas' }
  ]

  // Load data based on category
  const loadData = useCallback(async (category, isInitial = false, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      let data = []
      let hasMoreData = false

      switch (category) {
        case 'Personajes': {
          const charResult = await lotrAPI.getCharacters(page, 20)
          data = charResult.results
          hasMoreData = charResult.hasMore
          break
        }
        case 'Libros': {
          data = await lotrAPI.getBooks()
          hasMoreData = false
          break
        }
        case 'Mundos': {
          data = await lotrAPI.getLocations()
          hasMoreData = false
          break
        }
        case 'Peliculas': {
          data = await lotrAPI.getMovies()
          hasMoreData = false
          break
        }
        default:
          data = []
      }

      if (isInitial) {
        setItems(data)
        setFilteredItems(data)
        setCurrentPage(1)
      } else {
        setItems(prev => [...prev, ...data])
        setFilteredItems(prev => [...prev, ...data])
        setCurrentPage(page)
      }

      setHasMore(hasMoreData)
    } catch (err) {
      console.error('Error loading LOTR data:', err)
      setError('Error al cargar datos de la Tierra Media')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(activeCategory, true)
  }, [activeCategory, loadData])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setFilteredItems(items)
      return
    }

    const filtered = items.filter(item => {
      const name = item.name || item.title || ''
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredItems(filtered)
  }

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setSearchTerm('')
  }

  const handleItemClick = (item) => {
    // Only navigate for characters
    if (activeCategory === 'Personajes' && item._id) {
      navigate(`/lotr/character/${item._id}`)
    }
  }

  const loadMore = () => {
    loadData(activeCategory, false, currentPage + 1)
  }

  // Get appropriate image based on category
  const getItemImage = (item) => {
    switch (activeCategory) {
      case 'Personajes':
        return item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=400&background=10b981&color=fff`
      case 'Libros':
        return item.cover || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.name)}`
      case 'Mundos':
        return item.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`
      case 'Peliculas':
        return item.poster || `https://via.placeholder.com/300x450?text=${encodeURIComponent(item.name)}`
      default:
        return 'https://via.placeholder.com/300x400?text=LOTR'
    }
  }

  // Get item title based on category
  const getItemTitle = (item) => {
    return item.name || item.title || 'Sin título'
  }

  // Get item subtitle based on category
  const getItemSubtitle = (item) => {
    switch (activeCategory) {
      case 'Personajes':
        return item.race || 'Desconocido'
      case 'Libros':
        return 'Libro'
      case 'Mundos':
        return 'Ubicación'
      case 'Peliculas':
        return item.runtimeInMinutes ? `${item.runtimeInMinutes} min` : 'Película'
      default:
        return ''
    }
  }

  return (
    <div className="character-grid-page" style={{ background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)' }}>
      <aside className="sidebar" style={{ borderRightColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div className="sidebar-logo" onClick={() => navigate("/")} style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.2), transparent 70%)' }}>
          <div style={{ color: '#10b981'}}>
            <img src="/src/assets/icons/lotr.webp" alt="Lord of the Rings" />
        </div>
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
      {filteredItems.map((item, index) => (
        <div
          key={item._id || item.id || index}
          className="character-card"
          style={{ '--border-color': '#10b981' }}
          onClick={() => handleItemClick(item)}
        >
          <div className="card-glow"></div>
          <div className="card-id">#{(item._id || item.id || '').slice(-4)}</div>

          <div className="card-image-container" style={{ background: 'radial-gradient(circle at top, #10b981, #000)' }}>
            <img
              src={getItemImage(item)}
              alt={getItemTitle(item)}
              className="card-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(getItemTitle(item))
              }}
            />
          </div>

          <div className="card-info">
            <h3 className="card-name">{getItemTitle(item)}</h3>
            <div className="card-badges">
              <span
                className="badge"
                style={{ backgroundColor: '#10b981', color: '#fff' }}
              >
                {getItemSubtitle(item)}
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

    {!loading && hasMore && filteredItems.length > 0 && activeCategory === 'Personajes' && !searchTerm && (
      <div className="load-more-container">
        <button
          className="load-more-btn"
          onClick={loadMore}
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', borderColor: '#10b981' }}
        >
          Cargar más personajes
        </button>
      </div>
    )}

    {!loading && filteredItems.length === 0 && !error && (
      <div className="empty-state">
        <p>No se encontraron rastros en estas tierras</p>
      </div>
    )}
  </main>
    </div>
  )
}

export default LOTRCharacterGrid
