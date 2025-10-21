import { createContext, useState } from "react";

const AuthContext = createContext({});
export const AuthProvider = ({children}) => {
    const [auth, setAuthState] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    });

    const setAuth = (userData) => {
        setAuthState(userData)
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData))
        } else {
            localStorage.removeItem('user')
        }
    }

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext