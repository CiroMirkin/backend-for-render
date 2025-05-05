import { useState } from "react"
import loginService from '../services/login'
import noteService from '../services/notes'
import { useUser } from "../userProvider"

function LoginForm() {
    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('') 
    const [ user, setUser ] = useUser()

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
          console.error('Possibly wrong credentials')
          console.error(exception)
        }
    }

    return (
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
}

export default LoginForm