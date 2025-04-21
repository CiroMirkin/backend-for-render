
export function deleteThisNote({ id, notes }) {
    return notes.filter(note => String(note.id) !== String(id))
}