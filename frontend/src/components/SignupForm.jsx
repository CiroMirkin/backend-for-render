import { useState } from "react"
import userService from "../services/users"
import noteService from "../services/notes"
import { useUser } from "../userProvider"

function SignupForm() {
    const [username, setUsername] = useState('') 
    const [name, setName] = useState('') 
    const [password, setPassword] = useState('') 
    const [user, setUser] = useUser(null) 

    const handleSignup = async (event) => {
      event.preventDefault()
        
      try {
        const user = await userService.createUser({
          username, password, name
        })

        window.localStorage.setItem(
          'loggedNoteappUser', JSON.stringify(user)
        ) 
          
        noteService.setToken(user.token)
        setUser(user)
        setUsername('')
        setName('')
        setPassword('')
      } 
      catch (exception) {
        console.error('Possibly wrong credentials ', exception)
      }
    }

    return (
      <form onSubmit={handleSignup}>
        <div>
          name
          <input
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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
        <button type="submit">Signup</button>
      </form>
    )
}

export default SignupForm