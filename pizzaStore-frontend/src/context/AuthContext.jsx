import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({
        token: sessionStorage.getItem("token") || null,
        role : sessionStorage.getItem("role") || null,
        userId : sessionStorage.getItem("userId") || null,
        email: sessionStorage.getItem("email") || null,
        userName: sessionStorage.getItem("userName") || null,
    });

    const login = (token,role,userId,email,fullName) => {
        sessionStorage.setItem("token",token);
        sessionStorage.setItem("role",role);
        sessionStorage.setItem("userId",userId);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("userName", fullName)
        setAuth({token,role,userId,email,userName:fullName});
    };

    const logout = () => {
        sessionStorage.clear();
        setAuth({token:null,role:null,userId:null,emaill:null,userName:null});
    };

    return (
        <AuthContext.Provider value={{auth,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);