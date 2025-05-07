import axios from 'axios'
const baseUrl = '/api/users'

const createUser = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

export default { createUser }