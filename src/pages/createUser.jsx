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
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { LinearProgress } from '@mui/material';
function User() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)
  const [owner, setOwner] = useState(false)
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const fetchUser = async () => {
    try {
      setLoading(true)
      console.log(document.cookie)
      const res = await api.post('/user/userPro', { header: document.cookie },{ withCredentials: true });
      console.log(res);
      if (!res.data.user) {

        console.log("kjbn")
        navigate('/login')
        // return redirect('/login')
      }
      else {
        setUser(res.data.user)
        setLogin(true)
        if (res.data.user.role === 'Owner' || res.data.user.role === 'Manager') {
          setOwner(true)

        }
        else {
          navigate('/')
        }
        setLogin(true)
      }
      setLoading(false);
    }
    catch (e) { console.log(e) }
  }
  useEffect(() => {
    fetchUser();
  }, [])
  const handleChange = (e) => {
    setRole(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("kjnfd")
      const user = await fetch('http://localhost:3000/user/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "POST",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fname: fname,
          lname: lname,
          username: username,
          password: password,
          number: number,
          role: role
        }),
      })
      const userj = await user.json();
      console.log(userj.message);
      if (userj.message === "User created") {
        setTimeout(() => {
          toast.success("User Added successfully", {
            position: "top-center",
          });
        }, 100);
        setFname('')
        setLname('')
        setNumber('')
        setPassword('')
        setRole('')
        setUsername('')
      } else {
        if (userj.message.message) {
          console.log(userj.message.message)
          toast.warn(userj.message.message, {
            position: "top-center",
          });
        }
        else {
          console.log(userj.message)
          toast.warn(userj.message, {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.log(error)
      toast.warn('Invalid Data', {
        position: "top-center",
      });
    }
  }
  return (
    <>
      {loading && <LinearProgress />}
      {!loading && login && owner &&
        <>
          <NavBar user={user} />
          <div className="responsive">
            <div className="shadow card container">
              <h1 style={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Apple Color Emoji',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>ADD USER</h1>
              <Box
                component="form"
                // sx={{
                //   '& .MuiTextField-root': { m: 1, width: '25ch' },
                // }}
                sx={{
                  // width: 500,
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
                    onChange={e => setFname(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="outlined-required"
                    label="Last Name"
                    value={lname}
                    onChange={e => setLname(e.target.value)}
                  />
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
                    required
                    id="outlined-password-input"
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                    <Select
                      required
                      align="left"
                      fullWidth
                      margin="normal"
                      labelId="role"
                      id="role-select"
                      value={role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="Owner">Owner</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="CompOper">Computer Operator</MenuItem>
                      <MenuItem value="Staff">Staff</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    // required
                    fullWidth
                    margin="normal"
                    id="outlined-number"
                    label="Contact No."
                    // type="number"
                    inputProps={{ maxLength: 12 }}
                    value={number}
                    onChange={e => {
                      const regex = /^[0-9\b]+$/;
                      if (e.target.value == "" || regex.test(e.target.value)) {
                        setNumber(e.target.value);
                      }
                    }}

                  //   InputLabelProps={{
                  //     shrink: true,
                  //   }}
                  />
                  <Button variant="contained" margin="normal" onClick={handleSubmit}>Add User</Button>
                </div>
              </Box>

              <ToastContainer />
            </div>
          </div>
        </>}
    </>
  );
}

export default User;



// import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';

// export default function FullWidthTextField() {
//   return (
//     <Box
//       sx={{
//         width: 500,
//         maxWidth: '100%',
//       }}
//     >
//       <TextField fullWidth label="fullWidth" id="fullWidth" />
//     </Box>
//   );
// }
