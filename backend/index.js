const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Note = require('./models/note')
const { errorHandler } = require('./errorHandler')

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
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})

// UPDATE

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const note = {
    content: request.body.content
  }

  Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
  .then(updatedNote => {
    response.json(updatedNote)
  })
  .catch(error => next(error))
})

// DELETE

app.delete('/api/notes/:id', (request, response, next) => {
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