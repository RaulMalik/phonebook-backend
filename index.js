const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('dist'))

// Middleware
app.use(express.json()) // Parses JSON data sent in requests
app.use(cors()) // Allows requests from other origins (like your frontend)

// 3.7 & 3.8: Configure Morgan to log POST data
// We create a custom token 'body' that returns the request body stringified
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Hardcoded data for now
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// 3.1: Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2: Info page
app.get('/info', (request, response) => {
  const currentDate = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p>
  `)
})

// 3.3: Get single person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end() //
  }
})

// 3.4: Delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end() //
})

// Helper for 3.5
const generateId = () => {
  // Generates a random id big enough to avoid collisions
  return Math.floor(Math.random() * 1000000).toString()
}

// 3.5 & 3.6: Add person with validation
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Error handling
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})