import axios from 'axios'
const baseUrl = 'api/notes'

const getAllNotes = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNote = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const deleteNote = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default {
  getAllNotes,
  createNote,
  deleteNote
}
