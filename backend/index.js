const express = require('express')
const cors = require('cors')

const { deleteThisNote } = require('../domain/deleteNote')

const { notesInFile } = require('./notes')
let notes = [...notesInFile]

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// GET

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  
  note ? response.json(note) : response.status(404).end()
})

// POST

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  // If the received data is missing a value for the content property
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

// DELETE

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = deleteThisNote({ id, notes })

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})