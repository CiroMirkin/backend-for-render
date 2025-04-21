const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Note = require('./models/note')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// GET

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    response.json(note)
  })
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

  const newNote = new Note({
    content: body.content,
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  })

})

// DELETE

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(deletedNote => {
    if (deletedNote) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'Nota no encontrada' })
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})