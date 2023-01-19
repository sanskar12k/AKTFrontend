import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { ToastContainer, toast } from "react-toastify";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './login.css'
import { useNavigate } from 'react-router-dom';
import api from './api'
import NavBar from '../components/Nvbr';
import Skelton from '../skeleton/report';
import { CircularProgress, LinearProgress } from '@mui/material';

function User() {
  const [sale, setSale] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [paytm, setPaytm] = useState(0);
  const [hdfc, setHdfc] = useState(0);
  const [value, setValue] = useState(
    dayjs(Date.now())
  );
  const [store, setStore] = useState('AKT Old');
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)
  const fetchUser = async () => {
    try {
      setLoading(true)
      // console.log(localStorage.getItem('login'))
      console.log(document.cookie)
      const res = await api.post('/user/userPro', { header: document.cookie },{ withCredentials: true });
      console.log(res);
      if (!res.data.user) {
        navigate('/login')
      }
      else {

        setUser(res.data.user)
        console.log(res.data.user.role)
        if(res.data.user.role === 'Staff'){
          console.log('ss')
          navigate('/');
        }
        setLogin(true)
      }
      setLoading(false)
    }
    catch (e) {
      console.log(e)
      navigate('/login')
    }
  }
  const handleChangeStore = (e) => {
    setStore(e.target.value);
  };
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const report = await fetch('http://localhost:3000/user/addSale', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "POST",
          'Authorization':document.cookie
        },
        body: JSON.stringify({
          sale: sale,
          customer: customer,
          paytm: paytm,
          hdfc: hdfc,
          created: value,
          added: user._id,
          store: store,
          addedName: user.fname + ' ' + user.lname
        }),
      })
      const userj = await report.json();
      console.log(userj);
      if (userj.message === "Reported") {
        setTimeout(() => {
          toast.success("Report Added", {
            position: "top-center",
          });
        }, 100);
        setSale(0);
        setCustomer(0);
        setPaytm(0);
        setHdfc(0);
        setStore(' ');
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
      toast.warn('Error in data', {
        position: "top-center",
      });
    }
  }
  useEffect(() => {
    fetchUser();
  }, [])
  return (
    // {!login && }
    <>
      {loading && <LinearProgress/> }
      {!loading && login && user.role !== 'Staff' &&
      <>
      <NavBar user={user} />
      <div className="responsive">
       <div className="shadow card report container">
       <h1 style={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Apple Color Emoji',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>Daily Report</h1>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              fullWidth
                label="Date"
                margin="normal"
                inputFormat="MM/DD/YYYY"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
              <Select
                align="left"
                margin="normal"
                labelId="role"
                id="role-select"
                value={store}
                required
                label="Store"
                onChange={handleChangeStore}
              >
                {/* <MenuItem value=""></MenuItem> */}
                <MenuItem value="AKT Old">AKT Old</MenuItem>
                <MenuItem value="AKT New">AKT New</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="outlined-required"
              label="Sale"
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
              value={sale}
              type="number"
              onChange={e => setSale(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Customers"
              value={customer}
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              onChange={e => setCustomer(e.target.value)}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Paytm"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={paytm}
              onChange={e => setPaytm(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="HDFC"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={hdfc}
              onChange={e => setHdfc(e.target.value)}
            />
            <LoadingButton loading={loading} variant="contained" margin="normal" onClick={handleSubmit}>Submit</LoadingButton>
          </div>
        </Box>
    
        <ToastContainer />
      </div>
      </div>
      </>
      
      }
      </>
  );
}

export default User;
