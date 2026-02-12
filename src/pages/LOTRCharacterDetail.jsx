import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Heart, Skull, Crown, Ghost, Calendar } from 'lucide-react'
import { lotrAPI } from '../services/api'
import './CharacterDetail.css'

const LOTRCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCharacter = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await lotrAPI.getPersonById(id)
      setCharacter(data)
    } catch (err) {
      console.error('Error loading LOTR character:', err)
      setError('Error al cargar la información del personaje')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadCharacter()
  }, [loadCharacter])

  if (loading) {
    return (
      <div className="character-detail-page lotr-detail" style={{ background: '#020617' }}>
        <div className="loading">
          <div className="spinner" style={{ borderTopColor: '#10b981' }}></div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="character-detail-page lotr-detail" style={{ background: '#020617' }}>
        <div className="error-message" style={{ color: '#10b981' }}>{error || 'Personaje no encontrado'}</div>
        <button className="back-btn" onClick={() => navigate('/lotr')} style={{ background: '#10b981', color: '#fff' }}>
          Volver a la Tierra Media
        </button>
      </div>
    )
  }

  return (
    <div className="character-detail-page lotr-detail" style={{ background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)' }}>
      <button className="back-button" onClick={() => navigate('/lotr')} style={{ color: '#10b981' }}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        <section className="hero-section">
          <div className="hero-background" style={{ backgroundImage: `url(${character.image})`, opacity: 0.2 }} />
          <div className="hero-content">
            <div className="hero-image-container">
              <img src={character.image} alt={character.name} className="hero-image" style={{ borderColor: '#10b981' }} />
              <div className="image-glow" style={{ background: '#10b981' }}></div>
            </div>
            <div className="hero-info">
              <h1 className="hero-name" style={{ color: '#10b981', fontSize: '3.5rem', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                {character.name}
              </h1>
              <div className="hero-badges">
                <span className="badge-large" style={{ background: '#10b981', color: '#fff' }}>
                  {character.race}
                </span>
                <span className="badge-large" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: '#10b981' }}>
                  {character.gender}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="tab-content" style={{ marginTop: '2rem' }}>
          <div className="info-dashboard">
            <div className="dashboard-row">
              <div className="info-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                <h2 className="card-title" style={{ color: '#10b981' }}>
                  <User size={20} /> Rasgos de Linaje
                </h2>
                <div className="info-grid-compact">
                  <div className="info-item">
                    <span className="info-label"><Crown size={16} /> Raza</span>
                    <span className="info-value">{character.race}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Ghost size={16} /> Cabello</span>
                    <span className="info-value">{character.hair}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Heart size={16} /> Altura</span>
                    <span className="info-value">{character.height}</span>
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                <h2 className="card-title" style={{ color: '#10b981' }}>
                  <Calendar size={20} /> Historia Vital
                </h2>
                <div className="info-grid-single compact">
                  <div className="info-item">
                    <span className="info-label">Nacimiento</span>
                    <span className="info-value">{character.birth}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><Skull size={16} /> Fallecimiento</span>
                    <span className="info-value">{character.death}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cónyuge</span>
                    <span className="info-value">{character.spouse}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LOTRCharacterDetail
