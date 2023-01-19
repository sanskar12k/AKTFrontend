
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Link, useNavigate
} from "react-router-dom";
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import api from '../pages/api';
import { useState, useEffect } from 'react';

function NavBar(props) {
    const navigate = useNavigate();
    const logout = async() =>{
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        const res =await  api.post("/user/logout");
        console.log(res)
        if(res.status === 200){
            console.log(res)
            navigate("/login")
            window.location.reload()
        }
    }
    const [login, setLogin] = useState(false)
    const [user, setUser] = useState();
     const fetchSale = async () => {
      try {
          // console.log(localStorage.getItem('login'))
        const res = await api.post('/user/userPro', {tkn:localStorage.getItem('login'), id:localStorage.getItem('id')});
        console.log(res);
        if(!res.data.user){
          console.log("kjbn")
          // return redirect('/login')
        }
        else{
          setUser(res.data.user)
          setLogin(true)
        }
      }
      catch (e) { console.log(e) }
    }
    // useEffect(() => {
    //   fetchSale();
    // }, [])
    return (
        <>
            <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light">
                <Link class="navbar-brand ms-md-3" to="/"> AK Traders</Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        {props.user && <li class="nav-item">
                            <Link class="nav-link" to="/addReport"> Add Report</Link>
                        </li> }
                        {props.user && props.user.role !=='Staff' &&  props.user.role !=='CompOper' &&<li class="nav-item">
                            <Link class="nav-link" to="/create">Add User</Link>
                        </li>}
                    </ul>
                    {!props.user && <div class="nav-item ms-auto pe-md-3">
                            <Link class="nav-link " to="/login" >
                               Login
                            </Link>
                    
                        </div>}
                        {props.user && <div class="nav-item ms-auto pe-md-3">
                            <Link class="nav-link " to="/" >
                               {props.user.fname} {props.user.lname}
                            </Link>
                            
                            <Button variant="contained" margin="normal" onClick={logout}>Logout</Button>
                            
                        </div>}
                        
                </div>
            </nav>
        </>
    )
}

export default NavBar