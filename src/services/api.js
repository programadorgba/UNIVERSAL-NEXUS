import axios from 'axios'

// Backend Superhéroes
const SUPERHERO_API_BASE_URL = 'https://superhero-backend-yf8q.onrender.com/api/superhero'

const superheroApi = axios.create({
  baseURL: SUPERHERO_API_BASE_URL,
  timeout: 10000,
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
  searchByName: async (name) => {
    const response = await superheroApi.get(`/search/${name}`)
    return { 
      results: response.data.success ? response.data.data : [] 
    }
  },

  getById: async (id) => {
    const response = await superheroApi.get(`/character/${id}`)
    return response.data.success ? response.data.data : null
  }
}

// Comic Vine API
const COMICVINE_API_BASE_URL = 'https://superhero-backend-yf8q.onrender.com/api/comicvine'

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
      const response = await comicvineApi.get(`/character/${encodeURIComponent(characterName)}/media`)
      return response.data.success ? response.data.data : { movies: [], comics: [] }
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
  getAll: async (page = 1) => {
    const response = await pokemonApi.get('/')
    return response.data.results || []
  },

  // Buscar por nombre (filtrado del lado del cliente)
  searchByName: async (name) => {
    const q = (name || '').trim().toLowerCase()
    
    if (!q) {
      const all = await pokemonAPI.getAll()
      return { results: all }
    }

    const allPokemon = await pokemonAPI.getAll()
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

export { superheroApi, comicvineApi, harryPotterApi, pokemonApi }