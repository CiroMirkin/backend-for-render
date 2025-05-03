import { useEffect, useState } from 'react'
import './App.css'
import Notelist from './components/NoteList'
import noteService from './services/notes'
import loginService from './services/login'
import AddNoteForm from './components/AddNoteForm'
import { deleteThisNote } from '../../domain/deleteNote'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  /** Save user information and authentication token */
  const [ user, setUser ] = useState(null)

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

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } 
    catch (exception) {
      console.error('Wrong credentials')
    }
  }

  const LoginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const deleteNoteFunction = user != null ? deleteNote : () => {}

  return (
    <>
      <h1>Notes</h1>
      { user != null && <p>{user.name} logged-in</p> }
      { user == null && LoginForm() }
      
      <Notelist notes={notes} deleteNote={ deleteNoteFunction }/>
      <AddNoteForm addNote={addNote} newNote={newNote} setNewNote={setNewNote} />
    </>
  )
}

export default App
