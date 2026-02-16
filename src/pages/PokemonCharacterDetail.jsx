import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Shield, Zap, Heart, Activity, Target,
  TrendingUp, Ruler, Weight, Sparkles, Swords
} from 'lucide-react'
import { pokemonAPI } from '../services/api'
import './CharacterDetail.css'

const PokemonCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    loadPokemon()
  }, [id])

  const loadPokemon = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await pokemonAPI.getById(id)
      console.log('Pokemon data:', data)
      setPokemon(data)
    } catch (err) {
      console.error('Error loading pokemon:', err)
      setError('Error al cargar el Pokémon')
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type) => {
    const typeColors = {
      fire: '#f97316',
      water: '#3b82f6',
      grass: '#22c55e',
      electric: '#eab308',
      psychic: '#a855f7',
      dragon: '#8b5cf6',
      normal: '#94a3b8',
      fighting: '#dc2626',
      flying: '#06b6d4',
      poison: '#9333ea',
      ground: '#d97706',
      rock: '#78716c',
      bug: '#84cc16',
      ghost: '#6366f1',
      steel: '#71717a',
      ice: '#0ea5e9',
      dark: '#1f2937',
      fairy: '#ec4899'
    }
    return typeColors[type?.toLowerCase()] || '#ef4444'
  }

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const StatBar = ({ icon: Icon, label, value, maxValue = 255, color }) => {
    const percentage = Math.min((parseInt(value) / maxValue) * 100, 100)
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

  if (error || !pokemon) {
    return (
      <div className="character-detail-page">
        <div className="error-message">{error || 'Pokémon no encontrado'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/pokemon')}>
          Volver al Pokédex
        </button>
      </div>
    )
  }

  const primaryType = pokemon.types?.[0] || 'normal'
  const primaryColor = getTypeColor(primaryType)
  const pokemonImage = pokemon.image || pokemon.sprites?.front_default || 
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`

  return (
    <div className="character-detail-page" style={{ background: 'radial-gradient(circle at top, #200505 0%, #000000 100%)' }}>
      <button className="back-button" onClick={() => navigate('/pokemon')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="detail-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div 
            className="hero-background"
            style={{ 
              backgroundImage: `url(${pokemonImage})`,
              borderColor: primaryColor
            }}
          />
          
          <div className="hero-content">
            <div className="hero-image-container">
              <img
                src={pokemonImage}
                alt={pokemon.name}
                className="hero-image"
                style={{ borderColor: primaryColor }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=' + capitalize(pokemon.name)
                }}
              />
              <div className="image-glow" style={{ background: primaryColor }}></div>
            </div>

            <div className="hero-info">
              <div className="hero-badges">
                {pokemon.types && pokemon.types.map((type, index) => (
                  <span 
                    key={index}
                    className="badge-large"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    {capitalize(type)}
                  </span>
                ))}
              </div>

              <h1 className="hero-name">{capitalize(pokemon.name)}</h1>
              
              <p className="hero-real-name">
                <Sparkles size={20} />
                #{String(pokemon.id).padStart(3, '0')}
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
            className={`tab ${activeTab === 'evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            <TrendingUp size={20} />
            Evolución
          </button>
          <button
            className={`tab ${activeTab === 'moves' ? 'active' : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            <Swords size={20} />
            Movimientos
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab fade-in">
              <div className="info-dashboard">
                {/* Stats Row */}
                <div className="dashboard-row">
                  {/* Base Stats */}
                  {pokemon.stats && (
                    <div className="info-card stats-card">
                      <h2 className="card-title">
                        <Zap size={20} />
                        Estadísticas Base
                      </h2>
                      <div className="stats-grid">
                        <StatBar 
                          icon={Heart} 
                          label="HP" 
                          value={pokemon.stats.hp || 0}
                          color="#ef4444"
                        />
                        <StatBar 
                          icon={Swords} 
                          label="Ataque" 
                          value={pokemon.stats.attack || 0}
                          color="#f97316"
                        />
                        <StatBar 
                          icon={Shield} 
                          label="Defensa" 
                          value={pokemon.stats.defense || 0}
                          color="#3b82f6"
                        />
                        <StatBar 
                          icon={Sparkles} 
                          label="At. Especial" 
                          value={pokemon.stats.specialAttack || pokemon.stats['special-attack'] || 0}
                          color="#a855f7"
                        />
                        <StatBar 
                          icon={Shield} 
                          label="Def. Especial" 
                          value={pokemon.stats.specialDefense || pokemon.stats['special-defense'] || 0}
                          color="#06b6d4"
                        />
                        <StatBar 
                          icon={Zap} 
                          label="Velocidad" 
                          value={pokemon.stats.speed || 0}
                          color="#eab308"
                        />
                      </div>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="info-card bio-card">
                    <h2 className="card-title">
                      <Sparkles size={20} />
                      Información Básica
                    </h2>
                    <div className="info-grid-single compact">
                      {pokemon.height && (
                        <div className="info-item">
                          <span className="info-label">Altura</span>
                          <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
                        </div>
                      )}
                      {pokemon.weight && (
                        <div className="info-item">
                          <span className="info-label">Peso</span>
                          <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
                        </div>
                      )}
                      {pokemon.types && (
                        <div className="info-item">
                          <span className="info-label">Tipo(s)</span>
                          <span className="info-value">{pokemon.types.map(capitalize).join(', ')}</span>
                        </div>
                      )}
                      {pokemon.abilities && pokemon.abilities.length > 0 && (
                        <div className="info-item">
                          <span className="info-label">Habilidades</span>
                          <span className="info-value">{pokemon.abilities.map(capitalize).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info Row */}
                <div className="dashboard-row secondary">
                  {/* Physical */}
                  <div className="info-card">
                    <h2 className="card-title">
                      <Ruler size={20} />
                      Características Físicas
                    </h2>
                    <div className="info-grid-compact">
                      <div className="info-item">
                        <span className="info-label">Altura</span>
                        <span className="info-value">{pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'Desconocida'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Peso</span>
                        <span className="info-value">{pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'Desconocido'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Categoría</span>
                        <span className="info-value">{pokemon.category || 'Pokémon'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Generación</span>
                        <span className="info-value">{pokemon.generation || 'Desconocida'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Types Detail */}
                  <div className="info-card">
                    <h2 className="card-title">
                      <Target size={20} />
                      Tipos
                    </h2>
                    <div className="info-grid-single compact">
                      {pokemon.types && pokemon.types.map((type, index) => (
                        <div key={index} className="info-item">
                          <span className="info-label">Tipo {index + 1}</span>
                          <span 
                            className="info-value"
                            style={{ 
                              color: getTypeColor(type),
                              fontWeight: 'bold'
                            }}
                          >
                            {capitalize(type)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evolution' && (
            <div className="connections-tab fade-in">
              <div className="info-card">
                <h2 className="card-title">
                  <TrendingUp size={24} />
                  Cadena Evolutiva
                </h2>
                <div className="info-grid-single">
                  {pokemon.evolution && pokemon.evolution.length > 0 ? (
                    <div className="evolution-chain">
                      {pokemon.evolution.map((evo, index) => (
                        <div key={index} className="evolution-item">
                          <img 
                            src={evo.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                            alt={evo.name}
                            className="evolution-image"
                          />
                          <p className="evolution-name">{capitalize(evo.name)}</p>
                          {evo.level && <p className="evolution-level">Nivel {evo.level}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">
                      {pokemon.name} no tiene evoluciones registradas o es su forma final.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="media-tab fade-in">
              <div className="info-card">
                <h2 className="card-title">
                  <Swords size={24} />
                  Movimientos {pokemon.moves?.length > 0 && `(${pokemon.moves.length})`}
                </h2>
                {pokemon.moves && pokemon.moves.length > 0 ? (
                  <div className="moves-grid">
                    {pokemon.moves.slice(0, 20).map((move, index) => (
                      <div key={index} className="move-card">
                        <h4 className="move-name">{capitalize(move.name || move)}</h4>
                        {move.type && (
                          <span 
                            className="move-type"
                            style={{ backgroundColor: getTypeColor(move.type) }}
                          >
                            {capitalize(move.type)}
                          </span>
                        )}
                        {move.power && <p className="move-stat">Poder: {move.power}</p>}
                        {move.accuracy && <p className="move-stat">Precisión: {move.accuracy}%</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No hay movimientos registrados</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PokemonCharacterDetail