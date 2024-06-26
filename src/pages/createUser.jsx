import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { TextField, InputLabel, MenuItem, FormControl, Select, Box, LinearProgress } from '@mui/material';
import './login.css'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../Context/Auth';
import api from './api';
import { LoadingButton } from '@mui/lab';
function User() {
  const [value, setValue] = useState(
    dayjs(Date.now())
  );
  const [allStores, setAll] = useState([]);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)
  const [owner, setOwner] = useState(false)
  const [store, setStore] = useState('');
  const [buttonLoading, setBLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {curUser, getUser} = useAuth();
  const handleChange = (e) => {
    setRole(e.target.value);
  };
  async function checkRole(){
    if(curUser?.role === 'Staff' || curUser?.role === 'Store Associate' || curUser?.role === 'Senior Store Associate'){
      // console.log(curUser)
      navigate(`/profile/`+curUser?._id)
    }
    else if(curUser?.role == 'BillingAssociate'  || curUser?.role === 'Billing Associate'){
      navigate('/addReport')
    }
  }

  const getAllStores = async () => {
    try {
      const res = await api.get(`/store/allStores`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': document.cookie
          },
        },
        {
          withCredentials: true
        }
      );
      if (res.status === 200) {
        const data = res.data.stores;
        setAll(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBLoading(true);
    try {
      const user = await api.post('/user/create', 
        {
          fname: fname,
          lname: lname,
          username: username,
          password: password,
          number: number,
          role: role,
          store: store,
          dob:value
        },
        {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
         },
        }
      )
      // console.log(user);
      if (user.status === 201) {
        setTimeout(() => {
          toast.success(user.data.message, {
            position: "top-center",
          });
        }, 100);
        setFname('')
        setLname('')
        setNumber('')
        setPassword('')
        setRole('')
        setUsername('')
      }
        else {
          toast.warn(user, {
            position: "top-center",
          });
        }
        setBLoading(false);
    } catch (error) {
      toast.warn(error.response.data.error.details[0].message, {
        position: "top-center",
      });
    }
    setBLoading(false);
  }
  useEffect(()=>{
    checkRole();
    getAllStores();
  },[])
  return (
    <>
      {loading && <LinearProgress />}
      {!loading && (curUser?.role ==='Owner' || curUser?.role ==='Manager') &&
        <>
          <NavBar user={curUser} />
          <div className="responsive">
            <div className="shadow card container">
              <h1 style={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Apple Color Emoji',
                fontWeight: 700,
                letterSpacing: '.25rem',
                color: 'inherit',
                textDecoration: 'none',
              }}>ADD EMPLOYEE</h1>
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
                  <LocalizationProvider dateAdapter={AdapterDayjs} margin="dense" >
                    <DatePicker
                      className='date-picker mb-2'
                      fullWidth
                      label="Date of Birth"
                      margin="dense"
                      inputFormat="DD/MM/YYYY"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
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
                      {curUser.role === 'Owner' &&
                       <MenuItem value="Owner">Owner</MenuItem> 
                      }
                      {curUser.role === 'Owner' &&
                          <MenuItem value="Manager">Manager</MenuItem>
                        }
                      <MenuItem value="BillingAssociate">Billing Associate</MenuItem>
                      <MenuItem value="StoreAssociate">Staff</MenuItem>
                      <MenuItem value="SeniorStoreAssociate"> Senior Store Associate</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth className='mt-3' >
                    <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
                    <Select
                      required
                      align="left"
                      fullWidth
                      margin="normal"
                      labelId="store"
                      id="store-select"
                      value={store}
                      label="Store"
                      onChange={(e) => {
                        setStore(e.target.value)
                      }}
                    >
                     <MenuItem value=""></MenuItem>
                    {
                  allStores.map(store => {
                    return (
                      <MenuItem key={store._id} value={store.name}>{store.name}</MenuItem>
                    )
                  })
                }
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="outlined-number"
                    label="Contact No."
                    inputProps={{ maxLength: 12 }}
                    value={number}
                    onChange={e => {
                      const regex = /^[0-9\b]+$/;
                      if (e.target.value == "" || regex.test(e.target.value)) {
                        setNumber(e.target.value);
                      }
                    }}
                  />
                  <LoadingButton loading={buttonLoading} variant="contained" margin="normal" onClick={handleSubmit}>Add User</LoadingButton>
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
