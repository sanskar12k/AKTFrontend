import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { ToastContainer, toast } from "react-toastify";
import {Box, InputLabel, MenuItem, FormControl, Select, LoadingButton} from '@mui/material'; 
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './login.css'
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { LinearProgress } from '@mui/material';
import { useAuth } from '../Context/Auth';
import api from './api';
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
  const navigate = useNavigate();
  const {curUser} = useAuth();
  const handleChangeStore = (e) => {
    setStore(e.target.value);
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const report = await api.post('/user/addSale', {
        sale: sale,
        customer: customer,
        paytm: paytm,
        hdfc: hdfc,
        created: value,
        added: curUser._id,
        store: store,
        addedName: curUser.fname + ' ' + curUser.lname
      },
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization':document.cookie,
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode:'cors'
     })
      const userj = report;
      console.log(userj);
      if (userj.status === 200) {
        setTimeout(() => {
          toast.success(userj.data.message, {
            position: "top-center",
          });
        }, 100);
        setSale(0);
        setCustomer(0);
        setPaytm(0);
        setHdfc(0);
        setStore(' ');
      } else {
        if (userj.data.message) {
          console.log(userj.data.message)
          toast.warn(userj.data.message, {
            position: "top-center",
          });
        }
        else {
          console.log(userj.data.message)
          toast.warn(userj.data.message, {
            position: "top-center",
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      toast.warn('Error in data', {
        position: "top-center",
      });
    }
    setLoading(false);
  }
  return (
    <>
      {loading && <LinearProgress/> }
      {!loading && curUser?.role !== 'Staff' &&
      <>
      <NavBar user={curUser} />
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
          sx={{
            // width: 500,
            maxWidth: '100%',
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}
            >
              <DatePicker
              fullWidth
                label="Date"
                margin="dense"
                inputFormat="DD/MM/YYYY"
                value={value}
                align="left"
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                className="date-picker"
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControl fullWidth
             margin="dense"
             >
              <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
              <Select
                align="left"
                margin="dense"
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
              margin="dense"
              InputProps={{ inputProps: { min: 0 } }}
              value={sale}
              type="number"
              onChange={e => setSale(e.target.value)}
            />
            <TextField
              required
              fullWidth
              id="outlined-required"
              label="Customers"
              margin="dense"
              value={customer}
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              onChange={e => setCustomer(e.target.value)}
            />

            <TextField
              required
              fullWidth
              margin="dense"
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
              margin="dense"
              id="outlined-required"
              label="HDFC"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={hdfc}
              onChange={e => setHdfc(e.target.value)}
            />
            <LoadingButton loading={loading} variant="contained"  onClick={handleSubmit}>Submit</LoadingButton>
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
