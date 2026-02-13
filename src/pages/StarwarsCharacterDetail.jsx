import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Ruler, Weight, UserCircle, Globe, Ship, Film, Users } from 'lucide-react'
import { starWarsAPI } from '../services/api'
import './CharacterDetail.css'

const StarwarsCharacterDetail = () => {
  const { id, type } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mapear type de la URL a categoría de la API
  const categoryMap = {
    'character': 'people',
    'planet': 'planets',
    'starship': 'starships',
    'vehicle': 'vehicles',
    'species': 'species',
    'film': 'films'
  }
  
  const category = categoryMap[type] || 'people'

  const loadItem = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('📂 Categoría:', category, 'ID:', id)
      
      const data = await starWarsAPI.getById(category, id)
      console.log('📦 Data:', data)
      
      setItem(data)
    } catch (err) {
      console.error('Error loading Star Wars item:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [id, category])

  useEffect(() => {
    loadItem()
  }, [loadItem])

  if (loading) {
    return (
      <div className="character-detail-page sw-detail" style={{ background: '#000' }}>
        <div className="loading">
          <div className="spinner" style={{ borderTopColor: '#fbbf24' }}></div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="character-detail-page sw-detail" style={{ background: '#000' }}>
        <div className="error-message" style={{ color: '#fbbf24' }}>{error || 'No encontrado'}</div>
        <button className="back-btn" onClick={() => navigate('/starwars')} style={{ background: '#fbbf24', color: '#000' }}>
          Volver a la Galaxia
        </button>
      </div>
    )
  }

  // Renderizado condicional según categoría
  const renderDetails = () => {
    switch(category) {
      case 'people':
        return (
          <>
            <div className="info-card">
              <h2 className="card-title" style={{ color: '#fbbf24' }}>
                <User size={20} /> Atributos Físicos
              </h2>
              <div className="info-grid-compact">
                <div className="info-item">
                  <span className="info-label"><Ruler size={16} /> Altura</span>
                  <span className="info-value">{item.height} cm</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><Weight size={16} /> Peso</span>
                  <span className="info-value">{item.mass} kg</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><UserCircle size={16} /> Color de ojos</span>
                  <span className="info-value">{item.eye_color}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><User size={16} /> Color de piel</span>
                  <span className="info-value">{item.skin_color}</span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h2 className="card-title" style={{ color: '#fbbf24' }}>
                <Globe size={20} /> Información Biográfica
              </h2>
              <div className="info-grid-single compact">
                <div className="info-item">
                  <span className="info-label">Año de nacimiento</span>
                  <span className="info-value">{item.birth_year}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Género</span>
                  <span className="info-value">{item.gender}</span>
                </div>
              </div>
            </div>
          </>
        )
      
      case 'planets':
        return (
          <div className="info-card">
            <h2 className="card-title" style={{ color: '#fbbf24' }}>
              <Globe size={20} /> Información del Planeta
            </h2>
            <div className="info-grid-compact">
              <div className="info-item">
                <span className="info-label">Clima</span>
                <span className="info-value">{item.climate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Terreno</span>
                <span className="info-value">{item.terrain}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Población</span>
                <span className="info-value">{item.population}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Diámetro</span>
                <span className="info-value">{item.diameter} km</span>
              </div>
            </div>
          </div>
        )
      
      case 'starships':
      case 'vehicles':
        return (
          <div className="info-card">
            <h2 className="card-title" style={{ color: '#fbbf24' }}>
              <Ship size={20} /> Especificaciones
            </h2>
            <div className="info-grid-compact">
              <div className="info-item">
                <span className="info-label">Modelo</span>
                <span className="info-value">{item.model}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fabricante</span>
                <span className="info-value">{item.manufacturer}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Clase</span>
                <span className="info-value">{item.starship_class || item.vehicle_class}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Costo</span>
                <span className="info-value">{item.cost_in_credits} créditos</span>
              </div>
            </div>
          </div>
        )
      
      case 'species':
        return (
          <div className="info-card">
            <h2 className="card-title" style={{ color: '#fbbf24' }}>
              <Users size={20} /> Información de Especie
            </h2>
            <div className="info-grid-compact">
              <div className="info-item">
                <span className="info-label">Clasificación</span>
                <span className="info-value">{item.classification}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Designación</span>
                <span className="info-value">{item.designation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Idioma</span>
                <span className="info-value">{item.language}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Esperanza de vida</span>
                <span className="info-value">{item.average_lifespan} años</span>
              </div>
            </div>
          </div>
        )
      
      case 'films':
        return (
          <div className="info-card">
            <h2 className="card-title" style={{ color: '#fbbf24' }}>
              <Film size={20} /> Información de la Película
            </h2>
            <div className="info-grid-single compact">
              <div className="info-item">
                <span className="info-label">Episodio</span>
                <span className="info-value">{item.episode_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Director</span>
                <span className="info-value">{item.director}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Productor</span>
                <span className="info-value">{item.producer}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de estreno</span>
                <span className="info-value">{item.release_date}</span>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="character-detail-page sw-detail" style={{ background: 'radial-gradient(circle at top, #1a1a1a 0%, #000 100%)' }}>
      <button className="back-button" onClick={() => navigate('/starwars')} style={{ color: '#fbbf24' }}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        <section className="hero-section">
          <div className="hero-background" style={{ backgroundImage: `url(${item.image})`, opacity: 0.3 }} />
          <div className="hero-content">
            <div className="hero-image-container">
              <img 
                src={item.image} 
                alt={item.name || item.title} 
                className="hero-image" 
                style={{ borderColor: '#fbbf24' }}
                onError={(e) => {
                  if (e.target.dataset.errorHandled) return
                  e.target.dataset.errorHandled = 'true'
                  
                  const name = item.name || item.title || 'Unknown'
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=600&background=fbbf24&color=000&font-size=0.4&bold=true`
                }}
              />
              <div className="image-glow" style={{ background: '#fbbf24' }}></div>
            </div>
            <div className="hero-info">
              <h1 className="hero-name" style={{ color: '#fbbf24', fontSize: '3.5rem', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
                {item.name || item.title}
              </h1>
              <div className="hero-badges">
                <span className="badge-large" style={{ background: '#fbbf24', color: '#000' }}>
                  {category === 'people' ? item.gender : type}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="tab-content" style={{ marginTop: '2rem' }}>
          <div className="info-dashboard">
            <div className="dashboard-row">
              {renderDetails()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarwarsCharacterDetail
