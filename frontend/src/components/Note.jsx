import { useUser } from "../userProvider"

const Note = ({ note, deleteNote }) => {
    const user = useUser()[0]
    return (
      <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        {note.content} 
        { user != null && <button onClick={deleteNote}>Delete</button> }
      </li>
    )
  }
  
  export default Note
  