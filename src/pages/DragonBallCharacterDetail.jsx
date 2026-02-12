import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Shield, Zap, Heart, Activity, Target,
  User, BookOpen, Sparkles, Swords, TrendingUp
} from 'lucide-react'
import { dragonBallAPI } from '../services/api'
import './CharacterDetail.css'

const DragonBallCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  const loadCharacter = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dragonBallAPI.getById(id)
      console.log('Dragon Ball character data:', data)
      setCharacter(data)
    } catch (err) {
      console.error('Error loading DB character:', err)
      setError('Error al cargar detalles del personaje')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadCharacter()
  }, [id, loadCharacter])

  const getRaceColor = (race) => {
    if (!race) return '#f97316'
    const lowerRace = race.toLowerCase()
    if (lowerRace.includes('saiyan')) return '#facc15'
    if (lowerRace.includes('namekian')) return '#22c55e'
    if (lowerRace.includes('frieza')) return '#a855f7'
    if (lowerRace.includes('human')) return '#3b82f6'
    if (lowerRace.includes('android')) return '#ef4444'
    return '#f97316'
  }

  const StatBar = ({ icon: Icon, label, value, color }) => {
    // Ki can be massive numbers, so we handle it specially
    return (
      <div className="stat-bar">
        <div className="stat-label">
          <Icon size={18} />
          <span>{label}</span>
        </div>
        <div className="stat-progress">
          <div 
            className="stat-fill" 
            style={{ 
              width: '100%',
              background: `linear-gradient(90deg, ${color}, ${color}dd)`,
              opacity: 0.8
            }}
          />
          <span className="stat-value">{value}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="character-detail-page">
        <div className="loading">
          <div className="spinner" style={{ borderTopColor: '#f97316' }}></div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="character-detail-page">
        <div className="error-message">{error || 'Personaje no encontrado'}</div>
        <button className="back-button" onClick={() => navigate('/dragonball')}>
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>
    )
  }

  const raceColor = getRaceColor(character.race)

  return (
    <div className="character-detail-page" style={{ background: 'radial-gradient(circle at top, #1a0b00 0%, #000000 100%)' }}>
      <button className="back-button" onClick={() => navigate('/dragonball')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-background"
            style={{ 
              backgroundImage: `url(${character.image})`,
              borderColor: raceColor
            }}
          />
          
          <div className="hero-content">
            <div className="hero-image-container">
              <img
                src={character.image}
                alt={character.name}
                className="hero-image"
                style={{ borderColor: raceColor }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=' + character.name
                }}
              />
              <div className="image-glow" style={{ background: raceColor }}></div>
            </div>

            <div className="hero-info">
              <div className="hero-badges">
                <span 
                  className="badge-large"
                  style={{ backgroundColor: raceColor }}
                >
                  {character.race}
                </span>
                <span 
                  className="badge-large"
                  style={{ backgroundColor: '#475569' }}
                >
                  {character.affiliation}
                </span>
              </div>

              <h1 className="hero-name">{character.name}</h1>
              
              <p className="hero-real-name">
                <Sparkles size={20} />
                Ki Base: {character.ki}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <Shield size={20} />
            Información
          </button>
          <button
            className={`tab ${activeTab === 'transformations' ? 'active' : ''}`}
            onClick={() => setActiveTab('transformations')}
          >
            <TrendingUp size={20} />
            Transformaciones
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab fade-in">
              <div className="info-dashboard">
                <div className="dashboard-row">
                  {/* Stats */}
                  <div className="info-card stats-card">
                    <h2 className="card-title">
                      <Zap size={20} />
                      Poder de Pelea
                    </h2>
                    <div className="stats-grid">
                      <StatBar 
                        icon={Activity} 
                        label="Ki Inicial" 
                        value={character.ki}
                        color="#f97316"
                      />
                      <StatBar 
                        icon={Zap} 
                        label="Ki Máximo" 
                        value={character.maxKi}
                        color="#ef4444"
                      />
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="info-card bio-card">
                    <h2 className="card-title">
                      <BookOpen size={20} />
                      Historia
                    </h2>
                    <p className="info-text">{character.description}</p>
                    <div className="info-grid-single compact" style={{ marginTop: '1rem' }}>
                      <div className="info-item">
                        <span className="info-label">Género</span>
                        <span className="info-value">{character.gender}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Afiliación</span>
                        <span className="info-value">{character.affiliation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-row secondary">
                  {/* Origin */}
                  <div className="info-card">
                    <h2 className="card-title">
                      <Target size={20} />
                      Origen y Raza
                    </h2>
                    <div className="info-grid-compact">
                      <div className="info-item">
                        <span className="info-label">Raza</span>
                        <span className="info-value">{character.race}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Planeta</span>
                        <span className="info-value">{character.originPlanet?.name || 'Desconocido'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transformations' && (
            <div className="media-tab fade-in">
              <div className="info-card">
                <h2 className="card-title">
                  <TrendingUp size={24} />
                  Transformaciones {character.transformations?.length > 0 && `(${character.transformations.length})`}
                </h2>
                {character.transformations && character.transformations.length > 0 ? (
                  <div className="media-grid">
                    {character.transformations.map((trans, index) => (
                      <div key={index} className="media-card">
                        <img 
                          src={trans.image} 
                          alt={trans.name}
                          className="media-card-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x300?text=' + trans.name
                          }}
                        />
                        <div className="media-card-info">
                          <h3 className="media-card-title">{trans.name}</h3>
                          <p className="media-card-meta">Ki: {trans.ki}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">Este personaje no posee transformaciones registradas.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DragonBallCharacterDetail
