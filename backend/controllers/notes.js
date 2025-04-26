const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const note = await Note.findById(id)
    note ? response.json(note) : response.status(404).end()
  }
  catch (e) { next(e) }
})

// POST
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const newNote = new Note({
    content: body.content,
  })
  
  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote) // 201 is the http created code
  }
  catch(error) { next(error) }
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
notesRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  }
  catch (e) { next(e) }
})

module.exports = notesRouter