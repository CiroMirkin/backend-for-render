import { createContext, useContext } from "react";

const UserContext = createContext(null)

/** 
 * This returns and array with two elements: user and setUser. 
 * @example const [ user, setUser ] = useUser()
 * */
export const useUser = () => useContext(UserContext)

function UserProvider({ children, user, setUser }) {
    return (
        <UserContext.Provider value={[ user, setUser ]}>
            { children }
        </UserContext.Provider>
    )
}

export default UserProvider