import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Star } from 'lucide-react'
import { harryPotterAPI } from '../services/api'
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
    { id: 'hechizos',icon: hechizos, label: 'Conjuros' }

  ]

  useEffect(() => {
    loadCharacters()
  }, [])

  const loadCharacters = async () => {
    setLoading(true)
    setError(null)
    try {
      const all = await harryPotterAPI.getAll()
      setCharacters(all)
      setFilteredCharacters(all)
    } catch (err) {
      console.error('Error loading Harry Potter characters:', err)
      setError('Error al cargar personajes de Harry Potter')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      setFilteredCharacters(characters)
      return
    }

    setLoading(true)
    setError(null)

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

    if (categoryId === 'all') {
      setFilteredCharacters(characters)
      return
    }

    const filtered = characters.filter(
      (char) => char.house?.toLowerCase() === categoryId.toLowerCase()
    )

    setFilteredCharacters(filtered)
  }

  const getHouseColor = (house) => {
    const h = house?.toLowerCase() || ''
    if (h === 'gryffindor') return '#740001'
    if (h === 'slytherin') return '#1a472a'
    if (h === 'ravenclaw') return '#0e1a40'
    if (h === 'hufflepuff') return '#ffdb00'
    return '#64748b'
  }

  const handleCharacterClick = (characterId) => {
    navigate(`/harrypotter/character/${characterId}`)
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
                          <img 
                src={category.icon} 
                alt={category.label}
                className="category-icon"
              />  
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
        {loading && <div className="hp-loading"><div className="hp-spinner"></div></div>}

        {!loading && filteredCharacters.length > 0 && (
          <div className="hp-characters-grid">
            {filteredCharacters.map((character, index) => {
              const borderColor = getHouseColor(character.house)

              return (
                <div
                  key={character.id || index}
                  className="hp-character-card"
                  style={{ '--border-color': borderColor }}
                  onClick={() => handleCharacterClick(character.id)}
                >
                  <div className="hp-card-glow"></div>
                  <div className="hp-card-id">{character.house || 'Hogwarts'}</div>

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
                    <h3 className="hp-card-name">{character.name}</h3>

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
                    </div>
                  </div>
                </div>
              )
            })}
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

