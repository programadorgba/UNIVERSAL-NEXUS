import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Star, Film } from 'lucide-react'
import { harryPotterAPI, harryPotterExtrasAPI } from '../services/api'
import './HarryCharacterGrid.css'
// Importar iconos de categorías
import iconTodos from '../assets/SUPERapi/todosharry.png';
import gryffindor from '../assets/SUPERapi/grifi.png';
import slytherin from '../assets/SUPERapi/slept.png';
import ravenclaw from '../assets/SUPERapi/raven.png';
import hufflepuff from '../assets/SUPERapi/huff.png';
import pocimas from '../assets/SUPERapi/pocimas.png';
import hechizos from '../assets/SUPERapi/hechizos.png';


const hpFallbackImage = new URL('../assets/icons/harrypotter.webp', import.meta.url).href

const HarryCharacterGrid = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [filteredCharacters, setFilteredCharacters] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  

  const categories = [
    { id: 'all',icon : iconTodos, label: 'Todos' },
    { id: 'gryffindor', icon: gryffindor, label: 'Gryffindor' },
    { id: 'slytherin',icon: slytherin ,label: 'Slytherin' },
    { id: 'ravenclaw',icon: ravenclaw, label: 'Ravenclaw' },
    { id: 'hufflepuff',icon: hufflepuff, label: 'Hufflepuff' },
    { id: 'Pócimas',icon: pocimas, label: 'Pocimas' },
    { id: 'hechizos',icon: hechizos, label: 'Conjuros' },
    { id: 'movies', icon: <Film size={32} color="#d4af37" />, label: 'Películas' }
  ]

  const [hasMore, setHasMore] = useState(true)
  const [displayCount, setDisplayCount] = useState(20)

  const loadCharacters = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const all = await harryPotterAPI.getAll()
      setCharacters(all)
      setFilteredCharacters(all.slice(0, 20))
      setHasMore(all.length > 20)
      setActiveCategory('all')
    } catch (err) {
      console.error('Error loading Harry Potter characters:', err)
      setError('Error al cargar personajes de Harry Potter')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])

  const loadMoreCharacters = () => {
    const nextDisplayCount = displayCount + 20
    let source = characters
    
    if (activeCategory !== 'all' && !['hechizos', 'Pócimas', 'movies'].includes(activeCategory)) {
      source = characters.filter(char => char.house?.toLowerCase() === activeCategory.toLowerCase())
    }

    const nextBatch = source.slice(0, nextDisplayCount)
    setFilteredCharacters(nextBatch)
    setDisplayCount(nextDisplayCount)
    setHasMore(source.length > nextDisplayCount)
  }

  const loadExtras = async (type) => {
    setLoading(true)
    setError(null)
    setHasMore(false)
    try {
      let data = []
      if (type === 'hechizos') data = await harryPotterExtrasAPI.getSpells()
      else if (type === 'Pócimas') data = await harryPotterExtrasAPI.getPotions()
      else if (type === 'movies') data = await harryPotterExtrasAPI.getMovies()
      
      setFilteredCharacters(data)
    } catch (err) {
      console.error(`Error loading ${type}:`, err)
      setError(`Error al cargar ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setFilteredCharacters(characters.slice(0, 20))
      setDisplayCount(20)
      setHasMore(characters.length > 20)
      return
    }

    setLoading(true)
    setError(null)
    setHasMore(false)

    try {
      const result = await harryPotterAPI.searchByName(searchTerm)
      if (result.results && result.results.length > 0) {
        setFilteredCharacters(result.results)
        setError(null)
      } else {
        setFilteredCharacters([])
        setError('No se encontraron personajes')
      }
    } catch (err) {
      console.error('Error searching Harry Potter characters:', err)
      setError('Error al buscar personajes')
      setFilteredCharacters([])
    } finally {
      setLoading(false)
    }
  }

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId)
    setDisplayCount(20)

    if (categoryId === 'all') {
      setFilteredCharacters(characters.slice(0, 20))
      setHasMore(characters.length > 20)
      return
    }

    if (['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'].includes(categoryId)) {
      const filtered = characters.filter(
        (char) => char.house?.toLowerCase() === categoryId.toLowerCase()
      )
      setFilteredCharacters(filtered.slice(0, 20))
      setHasMore(filtered.length > 20)
    } else {
      // Cargar hechizos, pocimas o peliculas
      loadExtras(categoryId)
    }
  }

  const getHouseColor = (house) => {
    const h = house?.toLowerCase() || ''
    if (h === 'gryffindor') return '#740001'
    if (h === 'slytherin') return '#1a472a'
    if (h === 'ravenclaw') return '#0e1a40'
    if (h === 'hufflepuff') return '#ffdb00'
    return '#64748b'
  }

  const handleCharacterClick = (character) => {
    if (!character.type) {
      navigate(`/harrypotter/character/${character.id}`)
    }
  }

  return (
    <div className="hp-grid-page">
      <aside className="hp-sidebar">
        <div className="hp-sidebar-logo" onClick={() => navigate('/')}>
          <img src="/src/assets/icons/harrypotter.webp" alt="Harry Potter" />
        </div>

        <div className="hp-sidebar-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`hp-category-btn ${activeCategory === category.id ? 'hp-active' : ''}`}
              onClick={() => filterByCategory(category.id)}
              title={category.label}
            >
              {typeof category.icon === 'string' ? (
                <img 
                  src={category.icon} 
                  alt={category.label}
                  className="category-icon"
                />
              ) : (
                <div className="category-lucide-icon">
                  {category.icon}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      <main className="hp-main-content">
        <header className="hp-grid-header">
          <button className="hp-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Volver
          </button>

          <form className="hp-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="hp-search-input"
              placeholder="Buscar personaje de Harry Potter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="hp-search-btn">
              <Search size={20} />
              Buscar
            </button>
          </form>
        </header>

        {error && <div className="hp-error-message">{error}</div>}
        
        <div className="hp-characters-grid">
          {filteredCharacters.map((character, index) => {
            const borderColor = getHouseColor(character.house)

            return (
              <div
                key={character.id || index}
                className={`hp-character-card ${character.type ? 'hp-extra-card' : ''}`}
                style={{ '--border-color': borderColor }}
                onClick={() => handleCharacterClick(character)}
              >
                <div className="hp-card-glow"></div>
                <div className="hp-card-id">{character.type || character.house || 'Hogwarts'}</div>

                <div className="hp-card-image-container">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.name}
                      className="hp-card-image"
                      onError={(e) => {
                        e.currentTarget.src = hpFallbackImage
                      }}
                    />
                  ) : (
                    <img
                      src={hpFallbackImage}
                      alt={character.name}
                      className="hp-card-image"
                    />
                  )}
                </div>

                  <div className="hp-card-info">
                    <h3 className="hp-card-name" style={{ fontSize: character.type ? '1.1rem' : '1.4rem' }}>
                      {character.name}
                    </h3>

                    {character.description && (
                      <p className="hp-card-description" style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--hp-muted)',
                        margin: '0.5rem 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {character.description}
                      </p>
                    )}

                    <div className="hp-card-badges">
                      {character.house && (
                        <span
                          className="hp-badge hp-badge-house"
                          style={{ backgroundColor: borderColor }}
                        >
                          {character.house}
                        </span>
                      )}
                      {character.patronus && (
                        <span className="hp-badge hp-badge-patronus">
                          Patronus: {character.patronus}
                        </span>
                      )}
                      {character.type && (
                        <span className="hp-badge hp-badge-type">
                          {character.type}
                        </span>
                      )}
                      {character.release_date && (
                        <span className="hp-badge hp-badge-date">
                          {new Date(character.release_date).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
              </div>
            )
          })}
        </div>

        {loading && <div className="hp-loading"><div className="hp-spinner"></div></div>}

        {!loading && hasMore && filteredCharacters.length > 0 && !searchTerm && (
          <div className="load-more-container" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <button 
              className="load-more-btn" 
              onClick={loadMoreCharacters}
              style={{ background: 'linear-gradient(135deg, #740001 0%, #ae0001 100%)', borderColor: '#d4af37' }}
            >
              Cargar más personajes
            </button>
          </div>
        )}

        {!loading && filteredCharacters.length === 0 && !error && (
          <div className="hp-empty-state">
            <p>No se encontraron personajes</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default HarryCharacterGrid

