import React, { useContext, useState, createContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import api from '../pages/api'
const AuthContext = createContext()
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [curUser, setCurUser] = useState();
    const [loading, setLoader] = useState(false);
    const [role, setRole] = useState();
    async function signin(username, password) {
        try {
            const res = await fetch('http://localhost:3000/user/login', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "POST",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
            return res;
        } catch (error) {
            console.log(error)
            toast.warn(error.message, {
                position: "top-center",
            });
        }
    }

    async function getUser(){
        try {
            setLoader(true)
            console.log(document.cookie)
            const res = await api.post('/user/userPro', { header: document.cookie }, { withCredentials: true });
            console.log(res);
            if(res.data.user){
            setCurUser(res.data.user);
            setRole(res.data.user.role);
            }
            setLoader(false);
            return res.data.user
          }
          catch (e) {
            console.log(e)
            navigate('/login')
          }
    }

    useEffect(()=>{
       const res = async ()=>{ 
        await getUser()
       }
       return res;
    }, [])
    const val = {
        curUser,
        signin,
        role,
        getUser
    }
    
    return(
        <AuthContext.Provider value={val}>
       {!loading && children}
        </AuthContext.Provider>
    )
}