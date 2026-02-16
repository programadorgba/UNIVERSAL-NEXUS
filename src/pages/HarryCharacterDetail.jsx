import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  BookOpen,
  Sparkles,
  Users as UsersIcon,
  Wand2,
  Star
} from 'lucide-react'
import { harryPotterAPI } from '../services/api'
import './HarryCharacterDetail.css'

const hpFallbackImage = new URL('../assets/icons/harrypotter.webp', import.meta.url).href

const HarryCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCharacter()
  }, [id])

  const loadCharacter = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await harryPotterAPI.getById(id)
      console.log('Harry Potter character data:', data)
      setCharacter(data)
    } catch (err) {
      console.error('Error loading Harry Potter character:', err)
      setError('Error al cargar el personaje')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="hp-character-detail-page">
        <div className="hp-loading">
          <div className="hp-spinner"></div>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="hp-character-detail-page">
        <div className="hp-error-message">{error || 'Personaje no encontrado'}</div>
        <button className="hp-btn hp-btn-primary" onClick={() => navigate('/harrypotter')}>
          Volver al listado
        </button>
      </div>
    )
  }

  const houseColor = getHouseColor(character.house)

  return (
    <div className="hp-character-detail-page">
      <button className="hp-back-button" onClick={() => navigate('/harrypotter')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="hp-detail-container">
        <section className="hp-hero-section">
          <div
            className="hp-hero-background"
            style={{
              backgroundImage: `url(${character.image || hpFallbackImage})`,
              borderColor: houseColor
            }}
          />

          <div className="hp-hero-content">
            <div className="hp-hero-image-container">
              <img
                src={character.image || hpFallbackImage}
                alt={character.name}
                className="hp-hero-image"
                style={{ borderColor: houseColor }}
                onError={(e) => {
                  e.currentTarget.src = hpFallbackImage
                }}
              />
              <div className="hp-image-glow" style={{ background: houseColor }}></div>
            </div>

            <div className="hp-hero-info">
              <div className="hp-hero-badges">
                {character.house && (
                  <span
                    className="hp-badge-large"
                    style={{ backgroundColor: houseColor }}
                  >
                    {character.house}
                  </span>
                )}
                {character.wizard && (
                  <span className="hp-badge-large hp-badge-wizard">
                    {character.wizard ? 'Mago' : 'Muggle'}
                  </span>
                )}
              </div>

              <h1 className="hp-hero-name">{character.name}</h1>

              {character.actor && (
                <p className="hp-hero-actor">
                  <Star size={20} />
                  Interpretado por: {character.actor}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="hp-tab-content">
          <div className="hp-info-tab hp-fade-in">
            {/* Información Personal */}
            <div className="hp-info-card">
              <h2 className="hp-card-title">
                <User size={24} />
                Información Personal
              </h2>
              <div className="hp-info-grid">
                {character.alternate_names && character.alternate_names.length > 0 && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Nombres alternativos</span>
                    <span className="hp-info-value">{character.alternate_names.join(', ')}</span>
                  </div>
                )}
                {character.species && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Especie</span>
                    <span className="hp-info-value">{character.species}</span>
                  </div>
                )}
                {character.gender && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Género</span>
                    <span className="hp-info-value">{character.gender}</span>
                  </div>
                )}
                {character.dateOfBirth && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Fecha de nacimiento</span>
                    <span className="hp-info-value">{character.dateOfBirth}</span>
                  </div>
                )}
                {character.yearOfBirth && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Año de nacimiento</span>
                    <span className="hp-info-value">{character.yearOfBirth}</span>
                  </div>
                )}
                {character.ancestry && (
                  <div className="hp-info-item">
                    <span className="hp-info-label">Ascendencia</span>
                    <span className="hp-info-value">{character.ancestry}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="hp-grid-2">
              {/* Apariencia */}
              <div className="hp-info-card">
                <h2 className="hp-card-title">
                  <Sparkles size={24} />
                  Apariencia
                </h2>
                <div className="hp-info-grid">
                  {character.eyeColour && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Color de ojos</span>
                      <span className="hp-info-value">{character.eyeColour}</span>
                    </div>
                  )}
                  {character.hairColour && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Color de cabello</span>
                      <span className="hp-info-value">{character.hairColour}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Magia */}
              {(character.wand || character.patronus) && (
                <div className="hp-info-card">
                  <h2 className="hp-card-title">
                    <Wand2 size={24} />
                    Magia
                  </h2>
                  <div className="hp-info-grid">
                    {character.patronus && (
                      <div className="hp-info-item">
                        <span className="hp-info-label">Patronus</span>
                        <span className="hp-info-value">{character.patronus}</span>
                      </div>
                    )}
                    {character.wand?.wood && (
                      <div className="hp-info-item">
                        <span className="hp-info-label">Varita - Madera</span>
                        <span className="hp-info-value">{character.wand.wood}</span>
                      </div>
                    )}
                    {character.wand?.core && (
                      <div className="hp-info-item">
                        <span className="hp-info-label">Varita - Núcleo</span>
                        <span className="hp-info-value">{character.wand.core}</span>
                      </div>
                    )}
                    {character.wand?.length && (
                      <div className="hp-info-item">
                        <span className="hp-info-label">Varita - Longitud</span>
                        <span className="hp-info-value">{character.wand.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hogwarts */}
            {(character.hogwartsStudent || character.hogwartsStaff) && (
              <div className="hp-info-card">
                <h2 className="hp-card-title">
                  <BookOpen size={24} />
                  Hogwarts
                </h2>
                <div className="hp-info-grid">
                  {character.house && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Casa</span>
                      <span className="hp-info-value">{character.house}</span>
                    </div>
                  )}
                  {character.hogwartsStudent !== undefined && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Estudiante</span>
                      <span className="hp-info-value">{character.hogwartsStudent ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                  {character.hogwartsStaff !== undefined && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Personal</span>
                      <span className="hp-info-value">{character.hogwartsStaff ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actor */}
            {(character.actor || (character.alternate_actors && character.alternate_actors.length > 0)) && (
              <div className="hp-info-card">
                <h2 className="hp-card-title">
                  <UsersIcon size={24} />
                  Interpretación
                </h2>
                <div className="hp-info-grid single-column">
                  {character.actor && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Actor principal</span>
                      <span className="hp-info-value">{character.actor}</span>
                    </div>
                  )}
                  {character.alternate_actors && character.alternate_actors.length > 0 && (
                    <div className="hp-info-item">
                      <span className="hp-info-label">Actores alternativos</span>
                      <span className="hp-info-value">{character.alternate_actors.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HarryCharacterDetail

