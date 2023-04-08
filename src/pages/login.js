import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './login.css'
import { LoadingButton } from '@mui/lab';
import { useNavigate } from "react-router-dom";
import api from './api';
import NavBar from '../components/Nvbr';
import { useAuth } from '../Context/Auth';
import { LinearProgress } from '@mui/material';
function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState();
  const {signin, curUser} = useAuth();
  // const fetchUser = async () => {
  //   try {
  //     setLoader(true)
  //     console.log(document.cookie)
  //     const res = await api.post('/user/userPro', { header: document.cookie },{mode:'cors'}, { withCredentials: true });
  //     console.log(res);
  //     if (res.data.user) {
  //       setLoader(false)
  //       navigate('/')
  //     }
  //     setLoader(false)
  //   }
  //   catch (e) {
  //     console.log(e)
  //     setLoader(false)
  //     navigate('/login')
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signin(username, password)
      console.log(res)
      if (res.status === 200) {
        const userj = res;
        console.log(userj);
        setLoading(false);
        navigate('/');
        // window.location.reload();
      }
      else if (res.status === 401 || res.status === 400) {
        toast.warn("Invalid Credentials", {
          position: "top-center",
        });
      }
      else {
        console.log(res)
        toast.warn(res.error, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error)
      toast.warn(error.message, {
        position: "top-center",
      });
    }
    setLoading(false);
  }
  useEffect(() => {
    // fetchUser();
    console.log("curUser", curUser);
    if(curUser){
      navigate('/');
    }
  }, [])
  return (
    <>
      {loader && <LinearProgress/>}
      {!curUser && <>
        <NavBar user={user} />
        <div className="d-flex align-items-center h-100 responsive">
          <div className="shadow card container">
            <Box
              component="form"
              sx={{
                maxWidth: '100%',
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div>
                <h1>Log In</h1>
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  id="outlined-required"
                  label="Email"
                  type="email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <TextField
                  id="outlined-password-input"
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <LoadingButton loading={loading} variant="contained" margin="normal" onClick={handleSubmit}> Log In</LoadingButton>
              </div>
            </Box>
            <ToastContainer />
          </div>
        </div>
      </>
      }
    </>
  )

}

export default Login