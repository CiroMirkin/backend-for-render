const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

// GET
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const newNote = new Note({
    content: body.content,
    user: user._id
  })
  
  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
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