const Note = require('../models/note')

const initialNotes = [
  {
    content: 'I love drink',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

/** Allows create a database object ID that doesn't belong to any note object in the database. */
const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

/**  For check the notes stored in the database. */
const getNotesFromDB = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, getNotesFromDB
}