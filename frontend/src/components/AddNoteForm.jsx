
function AddNoteForm({ addNote, newNote, setNewNote}){
    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    
    return (
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">save</button>
        </form>
    )
}

export default AddNoteForm