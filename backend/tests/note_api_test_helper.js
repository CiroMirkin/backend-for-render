const Note = require('../models/note');

/**  For check the notes stored in the database. */
const getNotesFromDB = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

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

module.exports = {
    initialNotes, getNotesFromDB
}