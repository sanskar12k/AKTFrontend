import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './login.css'
import api from './api'
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { Grid, LinearProgress } from '@mui/material';
import Api from './api';
function User() {
    const [profile, setProfile] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [login, setLogin] = useState(false)
    const [owner, setOwner] = useState(false)
    const [user , setUser] = useState();
    const [loading, setLoading] = useState(false);
   
    const fetchUser = async () => {
      try {
        setLoading(true) 
        const res = await api.post('/user/userPro',{header: document.cookie},{ withCredentials: true });
        // console.log(res);
        if(!res.data.user){
          navigate('/login')
        }
        else{
          setUser(res.data.user)
          setLogin(true);
          setProfile(res.data.user);
            setFname(res.data.user.fname);
            setLname(res.data.user.lname);
            setNumber(res.data.user.number);
            setUsername(res.data.user.username);
          if(res.data.user.role === 'Owner' || res.data.user.role === 'Manager' )
            {
              setOwner(true)
            }
            
            // else{
            //   navigate('/')
            // }
            setLogin(true)
        }
        setLoading(false);
      }
      catch (e) { console.log(e) }
    }
      useEffect(() => {
        fetchUser();
      }, [])
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(user)
        try {
            console.log(user._id)
            const res = await Api.patch(`http://localhost:3000/user/${user._id}/edit`, {
                    fname:fname,
                    lname:lname,
                    username:username,
                    number:number,
            },
            {
              headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "POST",
              Accept: "application/json",
              'Authorization':document.cookie
            }
          },)
            const userj = res.data;
            // console.log(res.data);
            if (res.status === 200) {
                setTimeout(() => {
                  toast.success(userj.msg, {
                    position: "top-center",
                  });
                }, 100);
              } else {
                if(userj.msg){
                  console.log(userj.msg)
                toast.warn(userj.msg, {
                  position: "top-center",
                });
                }
                else{
                  console.log(userj.msg)
                  toast.warn(userj.msg, {
                  position: "top-center",
                });
                }
              }
        } catch (error) {
            console.log(error)
            toast.warn(error.msg, {
              position: "top-center",
            });
        }
    }
  return (
    <>
    {loading && <LinearProgress/>}
   { !loading && login && 
   <>
   <NavBar user={user}/>
    <div className="shadow  container p-4">
   <h1 style={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Apple Color Emoji',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>Profile</h1>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}  >
              <img src="https://picsum.photos/id/237/200/300" alt="Profile" />
              </Grid>
              <Grid item xs={12} md={7}>
              <Box
      component="form"
      // sx={{
      //   '& .MuiTextField-root': { m: 1, width: '25ch' },
      // }}
      sx={{
        maxWidth: '100%',
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      >
      <div>
      
        <TextField
          required
          id="outlined-required"
          label="First Name"
          fullWidth
          margin="normal"
          value={fname}
          // disabled={disable}
          onChange={e=>setFname(e.target.value)}
        />
        <TextField    
          fullWidth
          margin="normal"
          id="outlined-required"
          label="Last Name"
          value={lname}
          // disabled={disable}
          onChange={e=>setLname(e.target.value)}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          id="outlined-required"
          label="Email"
          type="email"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          id="outlined-number"
          label="Contact No."
          type="number"
          value={number}
          onChange={e=>setNumber(e.target.value)}
        />
       {profile._id === user._id && <Button variant="contained" margin="normal" onClick={handleSubmit}>Update Profile</Button>}
      </div>
         </Box>
              </Grid>
            </Grid>
      
         
      <ToastContainer />
    </div>
    </>}
    </>
  );
}

export default User;


