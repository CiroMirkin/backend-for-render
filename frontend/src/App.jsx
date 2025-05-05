import { useEffect, useState } from 'react'
import './App.css'
import Notelist from './components/NoteList'
import noteService from './services/notes'
import AddNoteForm from './components/AddNoteForm'
import { deleteThisNote } from '../../domain/deleteNote'
import LoginForm from './components/LoginForm'
import UserProvider from './userProvider'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  /** Save user information and authentication token */
  const [ user, setUser ] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
    console.log('iwi')
  }, [])

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
      <UserProvider user={user} setUser={setUser}>
        <h1>
          Notes { user != null &&  <span>of {user.name}</span> }
        </h1>
        
        { user == null 
          ? <div>
            <LoginForm />
            <Notelist notes={notes} deleteNote={ deleteNote }/>
          </div> 
          : <div>
            <Notelist notes={notes} deleteNote={ deleteNote }/>
            <AddNoteForm addNote={addNote} newNote={newNote} setNewNote={setNewNote} />
          </div>
        }
      </UserProvider>
      { 
        user != null && 
          <button 
            onClick={() => { 
              setUser(null); 
              window.localStorage.removeItem('loggedNoteappUser')
            }}
          >Sing out</button>
      }
    </>
  )
}

export default App
