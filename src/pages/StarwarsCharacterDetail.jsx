import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Ruler, Weight, UserCircle, Globe, Ship } from 'lucide-react'
import { starWarsAPI } from '../services/api'
import './CharacterDetail.css'

const StarwarsCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCharacter = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await starWarsAPI.getPersonById(id)
      setCharacter(data)
    } catch (err) {
      console.error('Error loading Star Wars character:', err)
      setError('Error al cargar el personaje')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadCharacter()
  }, [loadCharacter])

  if (loading) {
    return (
      <div className="character-detail-page sw-detail" style={{ background: '#000' }}>
        <div className="loading">
          <div className="spinner" style={{ borderTopColor: '#fbbf24' }}></div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="character-detail-page sw-detail" style={{ background: '#000' }}>
        <div className="error-message" style={{ color: '#fbbf24' }}>{error || 'Personaje no encontrado'}</div>
        <button className="back-btn" onClick={() => navigate('/starwars')} style={{ background: '#fbbf24', color: '#000' }}>
          Volver a la Galaxia
        </button>
      </div>
    )
  }

  return (
    <div className="character-detail-page sw-detail" style={{ background: 'radial-gradient(circle at top, #1a1a1a 0%, #000 100%)' }}>
      <button className="back-button" onClick={() => navigate('/starwars')} style={{ color: '#fbbf24' }}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        <section className="hero-section">
          <div className="hero-background" style={{ backgroundImage: `url(${character.image})`, opacity: 0.3 }} />
          <div className="hero-content">
            <div className="hero-image-container">
              <img src={character.image} alt={character.name} className="hero-image" style={{ borderColor: '#fbbf24' }} />
              <div className="image-glow" style={{ background: '#fbbf24' }}></div>
            </div>
            <div className="hero-info">
              <h1 className="hero-name" style={{ color: '#fbbf24', fontSize: '3.5rem', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
                {character.name}
              </h1>
              <div className="hero-badges">
                <span className="badge-large" style={{ background: '#fbbf24', color: '#000' }}>
                  {character.gender}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="tab-content" style={{ marginTop: '2rem' }}>
          <div className="info-dashboard">
            <div className="dashboard-row">
              <div className="info-card">
                <h2 className="card-title" style={{ color: '#fbbf24' }}>
                  <User size={20} /> Atributos Físicos
                </h2>
                <div className="info-grid-compact">
                  <div className="info-item">
                    <span className="info-label"><Ruler size={16} /> Altura</span>
                    <span className="info-value">{character.height} cm</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Weight size={16} /> Peso</span>
                    <span className="info-value">{character.mass} kg</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><UserCircle size={16} /> Color de ojos</span>
                    <span className="info-value">{character.eye_color}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><User size={16} /> Color de piel</span>
                    <span className="info-value">{character.skin_color}</span>
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
                    <span className="info-value">{character.birth_year}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Género</span>
                    <span className="info-value">{character.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-row">
               {character.vehicles?.length > 0 && (
                 <div className="info-card">
                   <h2 className="card-title" style={{ color: '#fbbf24' }}>
                     <Ship size={20} /> Vehículos
                   </h2>
                   <div className="info-grid-single compact">
                     {character.vehicles.map((v, i) => (
                       <div key={i} className="info-item">
                         <span className="info-value">{v}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarwarsCharacterDetail
