const Note = require('../models/note')

/** Allows create a database object ID that doesn't belong to any note object in the database. */
const getNonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

module.exports = {
  getNonExistingId
}