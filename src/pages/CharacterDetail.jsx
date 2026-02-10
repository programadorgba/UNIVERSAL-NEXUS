import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Shield, Zap, Heart, Brain, Activity, Target,
  User, Briefcase, Users as UsersIcon, Film, BookOpen
} from 'lucide-react'
import { superheroAPI, comicVineAPI } from '../services/api'
import './CharacterDetail.css'

const CharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [media, setMedia] = useState({ movies: [], comics: [] })
  const [loading, setLoading] = useState(true)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    loadCharacter()
  }, [id])

  useEffect(() => {
    if (activeTab === 'media' && character && !media.movies.length && !media.comics.length) {
      loadMedia()
    }
  }, [activeTab, character])

  const loadCharacter = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await superheroAPI.getById(id)
      console.log('Character data:', data)
      setCharacter(data)
    } catch (err) {
      console.error('Error loading character:', err)
      setError('Error al cargar el personaje')
    } finally {
      setLoading(false)
    }
  }

  const loadMedia = async () => {
    if (!character?.name) return
    
    setMediaLoading(true)
    try {
      const mediaData = await comicVineAPI.getCharacterMedia(character.name)
      console.log('Media data:', mediaData)
      setMedia(mediaData)
    } catch (err) {
      console.error('Error loading media:', err)
    } finally {
      setMediaLoading(false)
    }
  }

  const getPublisherColor = (publisher) => {
    const pub = publisher?.toLowerCase() || ''
    if (pub.includes('marvel')) return '#ed1d24'
    if (pub.includes('dc')) return '#0074e8'
    return '#64748b'
  }

  const getAlignmentInfo = (alignment) => {
    if (alignment === 'good') return { text: 'Héroe', color: '#10b981' }
    if (alignment === 'bad') return { text: 'Villano', color: '#7c3aed' }
    return { text: 'Neutral', color: '#64748b' }
  }

  const StatBar = ({ icon: Icon, label, value, color }) => {
    const percentage = parseInt(value) || 0
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
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}, ${color}dd)`
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
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="character-detail-page">
        <div className="error-message">{error || 'Personaje no encontrado'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/superheroes')}>
          Volver al grid
        </button>
      </div>
    )
  }

  const publisherColor = getPublisherColor(character.biography?.publisher)
  const alignmentInfo = getAlignmentInfo(character.biography?.alignment)

  // Generar URL de imagen desde CDN usando el ID
  const characterImage = `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/${character.id}.jpg`

  return (
    <div className="character-detail-page">
      <button className="back-button" onClick={() => navigate('/superheroes')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-background"
            style={{ 
              backgroundImage: `url(${characterImage})`,
              borderColor: publisherColor
            }}
          />
          
          <div className="hero-content">
            <div className="hero-image-container">
              <img
                src={characterImage}
                alt={character.name}
                className="hero-image"
                style={{ borderColor: publisherColor }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=' + character.name
                }}
              />
              <div className="image-glow" style={{ background: publisherColor }}></div>
            </div>

            <div className="hero-info">
              <div className="hero-badges">
                <span 
                  className="badge-large"
                  style={{ backgroundColor: publisherColor }}
                >
                  {character.biography?.publisher || 'Unknown'}
                </span>
                <span 
                  className="badge-large"
                  style={{ backgroundColor: alignmentInfo.color }}
                >
                  {alignmentInfo.text}
                </span>
              </div>

              <h1 className="hero-name">{character.name}</h1>
              
              {character.biography?.realName && 
               character.biography.realName !== character.name && 
               character.biography.realName !== '-' && (
                <p className="hero-real-name">
                  <User size={20} />
                  {character.biography.realName}
                </p>
              )}
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
            className={`tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <Film size={20} />
            Comics & Películas
          </button>
          <button
            className={`tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            <UsersIcon size={20} />
            Conexiones
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab fade-in">
              {/* Power Stats */}
              {character.powerstats && (
                <div className="info-card">
                  <h2 className="card-title">
                    <Zap size={24} />
                    Estadísticas de Poder
                  </h2>
                  <div className="stats-grid">
                    <StatBar 
                      icon={Brain} 
                      label="Inteligencia" 
                      value={character.powerstats.intelligence}
                      color="#3b82f6"
                    />
                    <StatBar 
                      icon={Activity} 
                      label="Fuerza" 
                      value={character.powerstats.strength}
                      color="#ef4444"
                    />
                    <StatBar 
                      icon={Zap} 
                      label="Velocidad" 
                      value={character.powerstats.speed}
                      color="#f59e0b"
                    />
                    <StatBar 
                      icon={Shield} 
                      label="Durabilidad" 
                      value={character.powerstats.durability}
                      color="#10b981"
                    />
                    <StatBar 
                      icon={Target} 
                      label="Poder" 
                      value={character.powerstats.power}
                      color="#8b5cf6"
                    />
                    <StatBar 
                      icon={Heart} 
                      label="Combate" 
                      value={character.powerstats.combat}
                      color="#ec4899"
                    />
                  </div>
                </div>
              )}

              {/* Biography - SINGLE COLUMN */}
              {character.biography && (
                <div className="info-card">
                  <h2 className="card-title">
                    <BookOpen size={24} />
                    Biografía
                  </h2>
                  <div className="info-grid-single">
                    {character.biography.realName && character.biography.realName !== '-' && (
                      <div className="info-item">
                        <span className="info-label">Nombre completo</span>
                        <span className="info-value">{character.biography.realName}</span>
                      </div>
                    )}
                    {character.biography.placeOfBirth && 
                     character.biography.placeOfBirth !== '-' && (
                      <div className="info-item">
                        <span className="info-label">Lugar de nacimiento</span>
                        <span className="info-value">{character.biography.placeOfBirth}</span>
                      </div>
                    )}
                    {character.biography.firstAppearance && character.biography.firstAppearance !== '-' && (
                      <div className="info-item">
                        <span className="info-label">Primera aparición</span>
                        <span className="info-value">{character.biography.firstAppearance}</span>
                      </div>
                    )}
                    {character.biography.publisher && (
                      <div className="info-item">
                        <span className="info-label">Editorial</span>
                        <span className="info-value">{character.biography.publisher}</span>
                      </div>
                    )}
                    {character.biography.alignment && (
                      <div className="info-item">
                        <span className="info-label">Alineación</span>
                        <span className="info-value">{alignmentInfo.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Apariencia y Trabajo - GRID DE 2 COLUMNAS */}
              <div className="grid-2">
                {/* Appearance */}
                {character.appearance && (
                  <div className="info-card">
                    <h2 className="card-title">
                      <User size={24} />
                      Apariencia
                    </h2>
                    <div className="info-grid">
                      {character.appearance.gender && character.appearance.gender !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Género</span>
                          <span className="info-value">{character.appearance.gender}</span>
                        </div>
                      )}
                      {character.appearance.race && character.appearance.race !== 'null' && character.appearance.race !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Raza</span>
                          <span className="info-value">{character.appearance.race}</span>
                        </div>
                      )}
                      {character.appearance.height && 
                       Array.isArray(character.appearance.height) && 
                       character.appearance.height[0] !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Altura</span>
                          <span className="info-value">{character.appearance.height.join(' / ')}</span>
                        </div>
                      )}
                      {character.appearance.weight && 
                       Array.isArray(character.appearance.weight) && 
                       character.appearance.weight[0] !== '- lb' && character.appearance.weight[0] !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Peso</span>
                          <span className="info-value">{character.appearance.weight.join(' / ')}</span>
                        </div>
                      )}
                      {character.appearance.eyeColor && character.appearance.eyeColor !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Color de ojos</span>
                          <span className="info-value">{character.appearance.eyeColor}</span>
                        </div>
                      )}
                      {character.appearance.hairColor && character.appearance.hairColor !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Color de cabello</span>
                          <span className="info-value">{character.appearance.hairColor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Work */}
                {character.work && (
                  <div className="info-card">
                    <h2 className="card-title">
                      <Briefcase size={24} />
                      Trabajo
                    </h2>
                    <div className="info-grid">
                      {character.work.occupation && character.work.occupation !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Ocupación</span>
                          <span className="info-value">{character.work.occupation}</span>
                        </div>
                      )}
                      {character.work.base && character.work.base !== '-' && (
                        <div className="info-item">
                          <span className="info-label">Base de operaciones</span>
                          <span className="info-value">{character.work.base}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="media-tab fade-in">
              {mediaLoading ? (
                <div className="coming-soon">
                  <div className="spinner"></div>
                  <p>Cargando películas y cómics...</p>
                </div>
              ) : (
                <>
                  {/* Movies */}
                  {media.movies && media.movies.length > 0 && (
                    <div className="media-section">
                      <div className="info-card">
                        <h2 className="card-title">
                          <Film size={24} />
                          Películas ({media.movies.length})
                        </h2>
                        <div className="media-grid">
                          {media.movies.map((movie, index) => (
                            <div key={index} className="media-card">
                              {movie.image?.medium_url && (
                                <img 
                                  src={movie.image.medium_url} 
                                  alt={movie.name}
                                  className="media-card-image"
                                />
                              )}
                              <div className="media-card-info">
                                <h3 className="media-card-title">{movie.name}</h3>
                                {movie.release_date && (
                                  <p className="media-card-meta">{movie.release_date}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comics */}
                  {media.comics && media.comics.length > 0 && (
                    <div className="media-section">
                      <div className="info-card">
                        <h2 className="card-title">
                          <BookOpen size={24} />
                          Cómics ({media.comics.length})
                        </h2>
                        <div className="media-grid">
                          {media.comics.map((comic, index) => (
                            <div key={index} className="media-card">
                              {comic.image?.medium_url && (
                                <img 
                                  src={comic.image.medium_url} 
                                  alt={comic.name}
                                  className="media-card-image"
                                />
                              )}
                              <div className="media-card-info">
                                <h3 className="media-card-title">{comic.name || comic.volume?.name}</h3>
                                {comic.cover_date && (
                                  <p className="media-card-meta">{comic.cover_date}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(!media.movies || media.movies.length === 0) && 
                   (!media.comics || media.comics.length === 0) && (
                    <div className="coming-soon">
                      <Film size={64} />
                      <h3>No se encontraron películas o cómics</h3>
                      <p>No hay información disponible para este personaje en Comic Vine.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="connections-tab fade-in">
              <div className="info-card">
                <h2 className="card-title">
                  <UsersIcon size={24} />
                  Conexiones
                </h2>
                <div className="info-grid-single">
                  {character.biography?.aliases && 
                   Array.isArray(character.biography.aliases) && 
                   character.biography.aliases.length > 0 && 
                   character.biography.aliases[0] !== '-' && (
                    <div className="info-item">
                      <span className="info-label">Alias</span>
                      <span className="info-value">{character.biography.aliases.join(', ')}</span>
                    </div>
                  )}
                  {character.connections?.connectedTo && 
                   character.connections.connectedTo !== '-' && (
                    <div className="info-item">
                      <span className="info-label">Afiliación a grupos</span>
                      <span className="info-value">{character.connections.connectedTo}</span>
                    </div>
                  )}
                  {character.connections?.relatives && 
                   character.connections.relatives !== '-' && (
                    <div className="info-item">
                      <span className="info-label">Parientes</span>
                      <span className="info-value">{character.connections.relatives}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {(!character.biography?.aliases || character.biography.aliases.length === 0 || character.biography.aliases[0] === '-') &&
               (!character.connections || 
                (character.connections.connectedTo === '-' && 
                 character.connections.relatives === '-')) && (
                <div className="coming-soon">
                  <UsersIcon size={64} />
                  <h3>Conexiones</h3>
                  <p>No hay información de conexiones disponible para este personaje.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CharacterDetail
