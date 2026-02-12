import axios from 'axios'

// ==========================================
// CONFIGURACIÓN DE BACKEND
// ==========================================

// 1. Cambia a 'http://localhost:3000' si estás ejecutando el servidor en tu propia computadora.
// 2. Cambia a la URL de Render si quieres usar el servidor en la nube.

const SUPERHERO_API_BASE_URL = 'https://superhero-backend-yoxj.onrender.com';
// const SUPERHERO_API_BASE_URL = 'http://localhost:3000'; 

console.log('Using Backend URL:', SUPERHERO_API_BASE_URL);

const superheroApi = axios.create({
  baseURL: SUPERHERO_API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

superheroApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Superhero API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const superheroAPI = {
  // Buscar por nombre (o obtener lista inicial si se mandan nombres populares)
  searchByName: async (name) => {
    try {
      const response = await superheroApi.get(`/api/superhero/search/${name}`)
      return { 
        results: response.data.success ? response.data.data : [] 
      }
    } catch (error) {
      console.error('Error searching Superhero:', error)
      return { results: [] }
    }
  },

  getById: async (id) => {
    try {
      const response = await superheroApi.get(`/api/superhero/character/${id}`)
      return response.data.success ? response.data.data : null
    } catch (error) {
      console.error('Error fetching Superhero by ID:', error)
      return null
    }
  }
}

// Star Wars API
const STARWARS_API_BASE_URL = 'https://starwars-backend-ic37.onrender.com'

const starwarsApi = axios.create({
  baseURL: STARWARS_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const starWarsAPI = {
  // Obtener personajes (paginado)
  getPeople: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/people?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars people:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener planetas (paginado)
  getPlanets: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/planets?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars planets:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener naves (paginado)
  getStarships: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/starships?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars starships:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener vehículos (paginado)
  getVehicles: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/vehicles?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars vehicles:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener especies (paginado)
  getSpecies: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/species?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars species:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener películas (paginado)
  getFilms: async (page = 1) => {
    try {
      const response = await starwarsApi.get(`/api/films?page=${page}`)
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        hasMore: !!response.data.next
      }
    } catch (error) {
      console.error('Error fetching Star Wars films:', error)
      return { results: [], count: 0, hasMore: false }
    }
  },

  // Obtener personaje por ID
  getPersonById: async (id) => {
    try {
      const response = await starwarsApi.get(`/api/people/${id}`)
      return response.data || null
    } catch (error) {
      console.error('Error fetching Star Wars person:', error)
      return null
    }
  },

  // Buscar por nombre
  searchPeople: async (name) => {
    try {
      const response = await starwarsApi.get(`/api/people?search=${encodeURIComponent(name)}`)
      return {
        results: response.data.results || []
      }
    } catch (error) {
      console.error('Error searching Star Wars people:', error)
      return { results: [] }
    }
  }
}

// Comic Vine API (Mismo host que el backend de superhéroes)
const COMICVINE_API_BASE_URL = `${SUPERHERO_API_BASE_URL}/api/comicvine`

const comicvineApi = axios.create({
  baseURL: COMICVINE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

comicvineApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Comic Vine API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const comicVineAPI = {
  getCharacterMedia: async (characterName) => {
    try {
      // Usar el nuevo discovery endpoint que devuelve todo de una vez
      const response = await comicvineApi.get(`/character-media/${encodeURIComponent(characterName)}`)
      
      if (response.data.success) {
        return {
          movies: response.data.data.movies || [],
          comics: response.data.data.comics || []
        }
      }
      return { movies: [], comics: [] }
    } catch (error) {
      console.error('Error fetching Comic Vine media:', error)
      return { movies: [], comics: [] }
    }
  }
}

// Harry Potter API (hp-api.onrender.com)
const HARRY_POTTER_API_BASE_URL = 'https://hp-api.onrender.com/api'

const harryPotterApi = axios.create({
  baseURL: HARRY_POTTER_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

harryPotterApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Harry Potter API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

const mapHarryPotterCharacter = (char) => {
  return {
    id: char.id,
    name: char.name,
    alternate_names: char.alternate_names || [],
    species: char.species,
    gender: char.gender,
    house: char.house,
    dateOfBirth: char.dateOfBirth,
    yearOfBirth: char.yearOfBirth,
    wizard: char.wizard,
    ancestry: char.ancestry,
    eyeColour: char.eyeColour,
    hairColour: char.hairColour,
    wand: char.wand,
    patronus: char.patronus,
    hogwartsStudent: char.hogwartsStudent,
    hogwartsStaff: char.hogwartsStaff,
    actor: char.actor,
    alternate_actors: char.alternate_actors || [],
    alive: char.alive,
    image: char.image
  }
}

export const harryPotterAPI = {
  // Todos los personajes
  getAll: async () => {
    const response = await harryPotterApi.get('/characters')
    const data = response.data || []
    return data.map(mapHarryPotterCharacter)
  },

  // Buscar por nombre
  searchByName: async (name) => {
    const q = (name || '').trim().toLowerCase()

    if (!q) {
      const all = await harryPotterAPI.getAll()
      return { results: all }
    }

    const allCharacters = await harryPotterAPI.getAll()
    const filtered = allCharacters.filter(char => 
      char.name.toLowerCase().includes(q) ||
      char.alternate_names.some(alt => alt.toLowerCase().includes(q))
    )

    return { results: filtered }
  },

  // Obtener por ID
  getById: async (id) => {
    if (!id) return null

    const response = await harryPotterApi.get(`/character/${id}`)
    const data = response.data
    
    if (!data || data.length === 0) return null

    return mapHarryPotterCharacter(data[0])
  },

  // Personajes por casa
  getByHouse: async (house) => {
    const response = await harryPotterApi.get(`/characters/house/${house}`)
    const data = response.data || []
    return data.map(mapHarryPotterCharacter)
  },

  // Solo estudiantes
  getStudents: async () => {
    const response = await harryPotterApi.get('/characters/students')
    const data = response.data || []
    return data.map(mapHarryPotterCharacter)
  },

  // Solo staff
  getStaff: async () => {
    const response = await harryPotterApi.get('/characters/staff')
    const data = response.data || []
    return data.map(mapHarryPotterCharacter)
  }
}

// PotterDB API (api.potterdb.com) - Para Hechizos, Pociones y Películas
const POTTERDB_API_BASE_URL = 'https://api.potterdb.com/v1'

const potterDbApi = axios.create({
  baseURL: POTTERDB_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const harryPotterExtrasAPI = {
  // Hechizos
  getSpells: async () => {
    try {
      const response = await potterDbApi.get('/spells')
      return response.data.data.map(spell => ({
        id: spell.id,
        name: spell.attributes.name,
        description: spell.attributes.effect || spell.attributes.description,
        type: 'Spell',
        image: spell.attributes.image || null,
        category: 'hechizos'
      }))
    } catch (error) {
      console.error('Error fetching spells:', error)
      return []
    }
  },

  // Pociones
  getPotions: async () => {
    try {
      const response = await potterDbApi.get('/potions')
      return response.data.data.map(potion => ({
        id: potion.id,
        name: potion.attributes.name,
        description: potion.attributes.effect || potion.attributes.description,
        type: 'Potion',
        image: potion.attributes.image || null,
        category: 'Pócimas'
      }))
    } catch (error) {
      console.error('Error fetching potions:', error)
      return []
    }
  },

  // Películas
  getMovies: async () => {
    try {
      const response = await potterDbApi.get('/movies')
      return response.data.data.map(movie => ({
        id: movie.id,
        name: movie.attributes.title,
        description: movie.attributes.summary,
        release_date: movie.attributes.release_date,
        type: 'Movie',
        image: movie.attributes.poster || null,
        category: 'movies'
      }))
    } catch (error) {
      console.error('Error fetching movies:', error)
      return []
    }
  }
}

// Pokemon API (pokemon-backend-f3xu.onrender.com)
const POKEMON_API_BASE_URL = 'https://pokemon-backend-f3xu.onrender.com/api/pokemon'

const pokemonApi = axios.create({
  baseURL: POKEMON_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

pokemonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Pokemon API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const pokemonAPI = {
  // Obtener todos los Pokemon (paginado)
  getAll: async (page = 1, limit = 20) => {
    const response = await pokemonApi.get(`?page=${page}&limit=${limit}`)
    return response.data.results || []
  },

  // Buscar por nombre (filtrado del lado del cliente)
  searchByName: async (name) => {
    const q = (name || '').trim().toLowerCase()
    
    if (!q) {
      const all = await pokemonAPI.getAll(1, 100)
      return { results: all }
    }

    const allPokemon = await pokemonAPI.getAll(1, 100)
    const filtered = allPokemon.filter(pokemon => 
      pokemon.name.toLowerCase().includes(q)
    )

    return { results: filtered }
  },

  // Obtener por ID
  getById: async (id) => {
    if (!id) return null
    const response = await pokemonApi.get(`/${id}`)
    return response.data || null
  }
}

// Dragon Ball API
const DRAGONBALL_API_BASE_URL = 'https://dragonball-backend-8mdg.onrender.com/api/characters'

const dragonBallApi = axios.create({
  baseURL: DRAGONBALL_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

dragonBallApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Dragon Ball API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const dragonBallAPI = {
  // Obtener todos los personajes (con límite para el grid inicial)
  getAll: async (page = 1, limit = 20) => {
    try {
      const response = await dragonBallApi.get(`?page=${page}&limit=${limit}`)
      return response.data.items || []
    } catch (error) {
      console.error('Error fetching Dragon Ball characters:', error)
      return []
    }
  },

  // Buscar por nombre
  searchByName: async (name) => {
    try {
      const response = await dragonBallApi.get(`?name=${encodeURIComponent(name)}`)
      // La API de DB devuelve un array directamente si busca por nombre exacto o similar?
      // Revisando la estructura: puede devolver un objeto o array.
      const data = response.data
      return { 
        results: Array.isArray(data) ? data : (data ? [data] : [])
      }
    } catch (error) {
      console.error('Error searching Dragon Ball character:', error)
      return { results: [] }
    }
  },

  // Obtener por ID
  getById: async (id) => {
    if (!id) return null
    try {
      const response = await dragonBallApi.get(`/${id}`)
      return response.data || null
    } catch (error) {
      console.error('Error fetching Dragon Ball character details:', error)
      return null
    }
  }
}

// LOTR API (Placeholder)
export const lotrAPI = {
  getPeople: async () => {
    // Mocking LOTR data for now
    const mockResults = [
      { id: '5cd9ad060229074400175650', name: 'Frodo Baggins', race: 'Hobbit', image: 'https://images.metadata.sky.com/pa/7fdb48e3-466d-4b8c-8515-46a78248c8b6_LOTR_Frodo_Baggins.jpg' },
      { id: '5cd9ad060229074400175651', name: 'Gandalf', race: 'Maia', image: 'https://vignette.wikia.nocookie.net/lotr/images/e/e7/Gandalf_the_Grey.jpg' },
      { id: '5cd9ad060229074400175662', name: 'Aragorn II Elessar', race: 'Human', image: 'https://vignette.wikia.nocookie.net/lotr/images/b/ba/Aragorn.jpg' },
      { id: '5cd9ad060229074400175677', name: 'Legolas', race: 'Elf', image: 'https://vignette.wikia.nocookie.net/lotr/images/3/33/Legolas_Greenleaf.jpg' },
      { id: '5cd9ad060229074400175678', name: 'Gimli', race: 'Dwarf', image: 'https://vignette.wikia.nocookie.net/lotr/images/4/43/Gimli.jpg' },
      { id: '5cd9ad060229074400175669', name: 'Galadriel', race: 'Elf', image: 'https://vignette.wikia.nocookie.net/lotr/images/b/ba/Galadriel.jpg' },
      { id: '5cd9ad060229074400175672', name: 'Boromir', race: 'Human', image: 'https://vignette.wikia.nocookie.net/lotr/images/b/b4/Boromir.jpg' },
      { id: '5cd9ad060229074400175653', name: 'Samwise Gamgee', race: 'Hobbit', image: 'https://vignette.wikia.nocookie.net/lotr/images/2/20/Samwise_Gamgee.jpg' },
      { id: '5cd9ad06022907440017565a', name: 'Peregrin Took', race: 'Hobbit', image: 'https://vignette.wikia.nocookie.net/lotr/images/8/8a/Pippin_Took.jpg' },
      { id: '5cd9ad060229074400175657', name: 'Meriadoc Brandybuck', race: 'Hobbit', image: 'https://vignette.wikia.nocookie.net/lotr/images/7/7b/Merry_Brandybuck.jpg' }
    ]
    return {
      results: mockResults,
      count: mockResults.length,
      hasMore: false
    }
  },
  getPersonById: async (id) => {
    // For now returning Frodo by default or a found character
    const characters = [
      { id: '5cd9ad060229074400175650', name: 'Frodo Baggins', race: 'Hobbit', gender: 'Male', birth: 'September 22, 2968', death: 'Unknown (Departed to the West in 3021)', spouse: 'None', hair: 'Brown', height: '3\'6"', image: 'https://images.metadata.sky.com/pa/7fdb48e3-466d-4b8c-8515-46a78248c8b6_LOTR_Frodo_Baggins.jpg' },
      { id: '5cd9ad060229074400175651', name: 'Gandalf', race: 'Maia', gender: 'Male', birth: 'Before the Shaping of Arda', death: 'January 25, 3019 (Reborn as Gandalf the White)', spouse: 'None', hair: 'Grey/White', height: 'Variable', image: 'https://vignette.wikia.nocookie.net/lotr/images/e/e7/Gandalf_the_Grey.jpg' }
    ]
    const found = characters.find(c => c.id === id) || characters[0]
    return found
  },
  searchPeople: async () => {
    return { results: [] }
  }
}

export { superheroApi, comicvineApi, harryPotterApi, pokemonApi, dragonBallApi, starwarsApi }