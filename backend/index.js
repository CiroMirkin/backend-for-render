const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Note = require('./models/note')

const app = express()
app.use(cors())
app.use(express.static('dist'))

// GET

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    note ? response.json(note) : response.status(404).end()
  })
  .catch(error => next(error))
})
app.use(express.json())

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

// UPDATE

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// DELETE

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(deletedNote => {
    response.status(204).end()
  }).catch(error => next(error))
})

// Unknown endpoint request handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})