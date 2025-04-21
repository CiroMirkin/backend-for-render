const Note = ({ note, deleteNote }) => {
  
    return (
      <li>
        {note.content} 
        <button onClick={deleteNote}>Delete</button>
      </li>
    )
  }
  
  export default Note
  