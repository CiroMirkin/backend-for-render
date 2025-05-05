import Note from "./Note"

function Notelist({ notes, deleteNote }) {
    return (
        <ul style={{ listStyle: 'none' }}>
            {notes.map((note) => (
                <Note
                    key={note.id}
                    note={note}
                    deleteNote={() => deleteNote(note.id)}
                />
            ))}
        </ul>
    )
}

export default Notelist