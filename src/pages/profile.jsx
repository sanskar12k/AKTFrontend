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
import { Grid, LinearProgress, Modal, Typography } from '@mui/material';
import Api from './api';
import OtpInput from 'react-otp-input';
import { useAuth } from '../Context/Auth';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

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
  const [user, setUser] = useState();
  const [phVerify, setVerify] = useState(false)
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState();
  const { userId } = useParams();
  const [open, setOpen] = useState(false);
  const [openCP, setOpenCP] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [otp, setOtp] = useState('');
  const handleOpenCP = () => setOpenCP(true);
  const handleCloseCP = () => setOpenCP(false);
  const [otpV, setOtpV] = useState(0)
  const [newPw, setNewPw] = useState('');
  function handleOtpChange(value) {
    setOtp(value);
  }
  const { getUser } = useAuth();
  const fetchUser = async () => {
    try {
      setLoading(true)
      // console.log(userId)
      const res = await api.get('/user/userPro',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': document.cookie
          }
        },
        { withCredentials: true }
      );
      const profile = await api.get(`/user/profile/${userId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': document.cookie
        }
      },
        { withCredentials: true });
      // console.log(profile.data.profile)
      if (!res.data.user) {
        navigate('/login')
      }
      else if (profile.status !== 200) {
        navigate('/')
      }
      else {
        // console.log(res.data.user)
        setUser(res.data.user)
        setLogin(true);
        setProfile(profile.data.profile);
        setFname(profile.data.profile.fname);
        setLname(profile.data.profile.lname);
        setNumber(profile.data.profile.number);
        setUsername(profile.data.profile.username);
        setRole(profile.data.profile.role)
        setVerify(profile.data.profile.phoneVerify);
        setDob(new Date(profile.data.profile.dob).toLocaleDateString('en-GB'))
        if (res.data.user.role === 'Owner' || res.data.user.role === 'Manager') {
          setOwner(true)
        }
        setLogin(true)
      }
      setLoading(false);
    }
    catch (e) {
      console.log(e)
      navigate('/')
    }
  }
  useEffect(() => {
    fetchUser();
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(user)
    try {
      // console.log(profile)
      const res = await Api.patch(`/user/${profile._id}/edit`, {
        fname: fname,
        lname: lname,
        username: username,
        number: number,
        role: role
      },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            'Authorization': document.cookie
          }
        },)
      const userj = res.data;
      if (res.status === 200) {
        setTimeout(() => {
          toast.success(userj.msg, {
            position: "top-center",
          });
        }, 100);
      } else {
        if (userj.msg) {
          // console.log(userj.msg)
          toast.warn(userj.msg, {
            position: "top-center",
          });
        }
        else {
          // console.log(userj.msg)
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
  const updatePasswordOtp = async (e) => {
    e.preventDefault();
    try {

      const res = await Api.get('/user/sendOtp', {
        headers: {
          'Authorization': document.cookie,
          'Content-Type': 'application/json'
        },
      });
      handleOpen();
      toast.success(res.data.message, {
        position: "top-center"
      })
      console.log(res);

    }
    catch (error) {
      console.log(error);
    }
  }
  const otpForVerification = async (e) => {
    e.preventDefault();
    try {
      setOtpV(1);
      const res = await Api.get('/user/sendOtpForNumVerify', {
        headers: {
          'Authorization': document.cookie,
          'Content-Type': 'application/json'
        },
      });
      handleOpen();
      toast.success(res.data.message, {
        position: "top-center"
      })
      // console.log(res);

    }
    catch (error) {
      console.log(error);
    }
  }
  const checkOTP = async (e) => {
    e.preventDefault();
    try {
      // const pwUser = await getUser();
      const res = await api.get('/user/userPro/',
        {
          headers: {
            'Authorization': document.cookie,
            'Content-Type': 'application/json'
          }
          ,
             withCredentials: true
        }
      );
      const pwUser = res.data.user;
      // console.log(otp)
      // console.log(pwUser.pwChange)
      if (pwUser.pwChange === otp) {
        console.log("Matched")
        handleClose();
        handleOpenCP();
      }
      else {
        toast.warn("OTP Verification failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const numberVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await Api.patch('/user/verifyPhone', {
        otp: otp
      },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            'Authorization': document.cookie
          }
        })
      if (res.status === 200) {
        setTimeout(() => {
          toast.success(res.data.message, {
            position: "top-center",
          });
        }, 100);
        window.location.reload();
      }
     else{ setTimeout(() => {
        toast.warn(res.data.message, {
          position: "top-center",
        });
      }, 100);
    }
      handleClose();
      setOtp('');
    } catch (error) {
      setTimeout(() => {
        toast.warn(error.response.data.message, {
          position: "top-center",
        });
      }, 100);
      console.log(error.response.data.message)
    }
  }
  const changePassword = async (e) => {
    e.preventDefault();
    if (!newPw) {
      toast.warn("Please enter a valid password", {
        position: 'top-center'
      })
      return;
    }
    try {
      const res = await Api.patch(`/user/changePassword`, {
        password: newPw,
        otp: otp,
      },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            'Authorization': document.cookie
          }
        })
      // console.log(res)
      if (res.status === 200) {
        setTimeout(() => {
          toast.success(res.data.message, {
            position: "top-center",
          });
        }, 100);
      }
      handleCloseCP();
      setNewPw('');
      setOtp('');
    } catch (error) {

    }
  }
  return (
    <>
      {loading && <LinearProgress />}
      {!loading && login &&
        <>
          <NavBar user={user} />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" className='text-center'>
               {otpV === 0 ? 'Update Password' :'Phone Number Verification'}
              </Typography>
              <Typography id="modal-modal-description" variant='p' component="p" className='text-muted text-center' sx={{ mt: 1 }}>
                Enter your 4-digit OTP sent to your registered number
              </Typography>
              <div className="otp-container">
                <div className="otp-box">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    className="otp-box"
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
                <Button variant="contained" margin="normal" className='mt-2 ' onClick={otpV === 0 ? checkOTP : numberVerify }>Submit</Button>

              </div>
            </Box>
          </Modal>
          <Modal
            open={openCP}
            onClose={handleCloseCP}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" className=''>
                New Password
              </Typography>
              <Typography id="modal-modal-description" variant='p' component="p" className=' ' sx={{ mt: 2 }}>
                Enter your new password
              </Typography>
              <div className="otp-containers">
                <TextField
                  required
                  id="outlined-password-input"
                  fullWidth
                  margin="normal"
                  label="Password"
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <Button variant="contained" margin="normal" className='mt-2 ' onClick={changePassword}>Change Password</Button>

              </div>
            </Box>
          </Modal>
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
                      fullWidth
                      error={!phVerify}
                      margin="normal"
                      id="outlined-number"
                      label="Contact No."
                      helperText={phVerify ? '' : 'Not Verified '}
                      className={phVerify ? 'mb-0' : ''}
                      value={number}
                      onChange={e => {
                        const regex = /^[0-9\b]+$/;
                        if (e.target.value == "" || regex.test(e.target.value)) {
                          setNumber(e.target.value);
                        }
                      }
                      }

                    />
                    {!phVerify ? <Button className='verify-btn' onClick={otpForVerification}>Verify Now</Button> : ''}
                    <TextField
                      fullWidth
                      margin="normal"
                      id="outlined-number"
                      label="Date of Birth"
                      disabled={true}
                      value={dob}

                    />
                    {(user.role === 'Owner' || user.role === 'Manager') && <FormControl fullWidth>
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
                        onChange={e => setRole(e.target.value)}
                      >
                        <MenuItem value=""></MenuItem>
                        {user.role === 'Owner' && <MenuItem value="Owner">Owner</MenuItem>}
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="CompOper">Computer Operator</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                      </Select>
                    </FormControl>}
                    {/* {!mailVerify && <div className='mb-2'> <Button variant="outlined"  color='success' margin="normal" onClick={handleSubmit}>Verify Phone Number</Button> </div> } */}
                    {(profile._id === user._id || user.role === 'Manager' || user.role === 'Owner') && <div>
                      <Button variant="contained" margin="normal" className='mt-2 me-2' onClick={handleSubmit}>Update Profile</Button>
                      <Button variant="contained" margin="normal" className='mt-2 ms-2' onClick={updatePasswordOtp}>Change Password</Button>

                    </div>}
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


