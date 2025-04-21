import { useEffect, useState } from 'react'
import './App.css'
import Notelist from './components/NoteList'
import noteService from './services/notes'
import AddNoteForm from './components/AddNoteForm'
import { deleteThisNote } from '../../domain/deleteNote'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    noteService.getAllNotes().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote
    }
    
    noteService.createNote(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const deleteNote = (id) => {
    noteService.deleteNote(id).then(response => {
      const newNotes = deleteThisNote({ id, notes })
      setNotes(newNotes)
    })
  }

  return (
    <>
      <h1>Notes</h1>
      <Notelist notes={notes} deleteNote={deleteNote}/>
      <AddNoteForm addNote={addNote} newNote={newNote} setNewNote={setNewNote} />
    </>
  )
}

export default App
