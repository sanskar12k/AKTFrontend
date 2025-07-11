import React, { useContext, useState, createContext, useEffect } from 'react';
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
            const res = await api.post('/user/login/', {
                username: username,
                password: password
              }, {
                headers: {
                  "Content-Type": "application/json"
                }
                // withCredentials: true,
              });
            const token = res.data.token;
            document.cookie = `token=${token}; path=/;`;
            console.log(document.cookie);
            setCurUser(res.data.userEmail)
            return res;
        } catch (error) {
            console.log(error.response.data.err);
            return error.response;
        }
    }

    async function getUser() {
        setLoader(true);
        try {
            // console.log(document.cookie)
            const res = await api.get('/user/userPro/',
            {
                withCredentials: false
              ,  headers: {
                'Authorization': document.cookie,
                'Content-Type': 'application/json'
              }
              
            }
            );
            if(res.status === 403){
                navigate('/login');
            }
            // console.log(res.data.user)
            setCurUser(res.data.user);
            setLoader(false);
            return res.data.user
        }
        catch (e) {
            console.log(e);
            navigate('/login')
        }
        setLoader(false);
    }

    useEffect(() => {
       getUser();
    }, [])
    const val = {
        curUser,
        signin,
        role,
        getUser
    }

    return (
        <AuthContext.Provider value={val}>
            {!loading && children}
        </AuthContext.Provider>
    )
}



