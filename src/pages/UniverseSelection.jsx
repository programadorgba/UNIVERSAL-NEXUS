import { useNavigate } from 'react-router-dom'
import { Zap, Sparkles, Wand2, Film, Lock } from 'lucide-react'
import './UniverseSelection.css'

const UniverseSelection = () => {
  const navigate = useNavigate()

  const universes = [
    {
      id: 'superheroes',
      name: 'Superhéroes',
      icon: <Zap size={48} />,
      color: 'var(--primary)',
      gradient: 'var(--gradient-primary)',
      description: 'Marvel, DC Comics y más',
      enabled: true
    },
    {
      id: 'starwars',
      name: 'Star Wars',
      icon: <Sparkles size={48} />,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      description: 'La galaxia muy, muy lejana',
      enabled: true
    },
    {
      id: 'harrypotter',
      name: 'Harry Potter',
      icon: <Wand2 size={48} />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'El mundo mágico',
      enabled: false
    },
    {
      id: 'lotr',
      name: 'El Señor de los Anillos',
      icon: <Sparkles size={48} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'La Tierra Media',
      enabled: true
    },
    {
      id: 'disney',
      name: 'Disney',
      icon: <Sparkles size={48} />,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      description: 'Personajes Disney',
      enabled: false
    },
    {
      id: 'movies',
      name: 'Películas',
      icon: <Film size={48} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Cine y series',
      enabled: false
    }
  ]

  const handleUniverseClick = (universe) => {
    if (universe.enabled) {
      navigate(`/${universe.id}`)
    }
  }

  return (
    <div className="universe-selection">
      <div className="universe-container">
        <div className="universe-header fade-in">
          <h1 className="universe-title">
            Explora los Universos
          </h1>
          <p className="universe-subtitle">
            Elige tu universo favorito para comenzar la aventura
          </p>
        </div>

        <div className="universe-grid">
          {universes.map((universe, index) => (
            <div
              key={universe.id}
              className={`universe-card ${universe.enabled ? 'enabled' : 'disabled'} scale-in`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--card-gradient': universe.gradient
              }}
              onClick={() => handleUniverseClick(universe)}
            >
              <div className="universe-card-inner">
                <div 
                  className="universe-icon"
                  style={{ color: universe.color }}
                >
                  {universe.icon}
                </div>
                
                <h3 className="universe-name">{universe.name}</h3>
                <p className="universe-description">{universe.description}</p>

                {!universe.enabled && (
                  <div className="universe-locked">
                    <Lock size={24} />
                    <span>Próximamente</span>
                  </div>
                )}

                {universe.enabled && (
                  <div className="universe-badge">
                    <span>¡Disponible!</span>
                  </div>
                )}
              </div>

              {universe.enabled && (
                <div className="universe-shine"></div>
              )}
            </div>
          ))}
        </div>

        <div className="universe-footer fade-in" style={{ animationDelay: '0.6s' }}>
          <p>Más universos próximamente...</p>
        </div>
      </div>
    </div>
  )
}

export default UniverseSelection
