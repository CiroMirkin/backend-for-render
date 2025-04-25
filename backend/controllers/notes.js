const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    note ? response.json(note) : response.status(404).end()
  })
  .catch(error => next(error))
})

// POST
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})

// UPDATE
notesRouter.put('/:id', (request, response, next) => {
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
notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id).then(deletedNote => {
    response.status(204).end()
  }).catch(error => next(error))
})

module.exports = notesRouter