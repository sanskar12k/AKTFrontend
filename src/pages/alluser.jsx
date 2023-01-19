import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
import './login.css'
import api from './api'
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { Box, Card, CardContent, Grid, IconButton, LinearProgress, Modal, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

function User() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)
  const [owner, setOwner] = useState(false)
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [delUser, setDelUser] = useState();
  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await api.post('/user/userPro', { header: document.cookie },{ withCredentials: true });
      console.log(res);
      if (!res.data.user) {
        console.log("kjbn")
        navigate('/login')
      }
      else {
       setUser(res.data.user)
        setLogin(true);
        if (res.data.user.role === 'Owner' || res.data.user.role === 'Manager') {
          setOwner(true)
        }
        else {
          navigate('/')
        }
        setLogin(true);
        await fetchAlluser();
      }
    
      setLoading(false);
    }
    catch (e) {
      console.log(e)
    }
  }



  const fetchAlluser = async() => {
    // await fetchUser();
    const users = await api.get(`/user/alluser`,
    {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization':document.cookie
    },
    });
    console.log(users);
    if (users.status === 200) {
      setUsers([...users.data.users])
    }
  }


  const deleteUser = async(id) =>{
    try{
      const res = await api.delete( `/user/${id}/delete`,
      {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      },
        data:{
          header:document.cookie
        }
      });
      console.log(res);
      if(res.status === 200)
      {
        if(res.data.res)
        {
          toast.success("User Deleted successfully", {
           position: "top-center",
           }
      );
      fetchAlluser();
      
    }
      else{
        toast.warn("User not found",{
          position:"top-center",
        })
      }
    handleClose();
    }
    }
    catch(err){
      console.log(err)
    }
  }


  useEffect(() => {
    // fetchAlluser();
    fetchUser();
  }, [])

  return (
    <>
      {loading && <LinearProgress />}
      {!loading && login && owner &&
        <>
        
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="p">
      Are you sure you want to delete this user?
      {/* <Button onClick={() => {deleteUser(delUser)}}>Delete</Button> */}
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }} align='center' >
    <Button align='center' variant='contained' color='error' onClick={() => {deleteUser(delUser)}}>Delete</Button>
          </Typography>
  </Box>
</Modal>
          <NavBar user={user} />
          <div className="shadow  container p-4">
            <h1 style={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Apple Color Emoji',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>Users</h1>
            <Grid container spacing={3}>
                {users.map((user) => 
                  (
                  <>
                    <Grid item xs={12} sm={6} md={4}  key={user._id}>
                    <Card>
                    <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <img src="https://picsum.photos/id/237/130/200" alt="Profile" /> 
                      </Grid>
                      <Grid item xs={8} className="ps-0">
                      <CardContent >
                        <Typography variant='h6' component="div" paddingBottom={1} align='left'>
                          {user.fname} {user.lname}
                        </Typography>
                        <Typography variant='p'  component="div"  align='left' >
                          {user.username}
                        </Typography>
                        <Typography variant='p' component="div"  align='left' >
                          {user.role}
                        </Typography>
                        <Typography variant='p' component="div"  align='left'>
                          {user.number}
                        </Typography>
                        <Typography variant='p' component="div"  align='right'>
                        <IconButton aria-label='delete' size="large" align='right'>
                        <Edit/>
                       </IconButton>
                       {/* <Button onClick={() => {handleOpen(); setDelUser(user._id) }}>Open modal</Button> */}
                        <IconButton aria-label='delete' size="large" align='right' >
                        <DeleteIcon onClick={() => {handleOpen(); setDelUser(user._id) }} />
                       </IconButton>
                        </Typography>
                      
                      </CardContent>
                      </Grid>
                      </Grid>
                      
                    </Card>
                    </Grid>
                  </>
                ))}
            </Grid>


            <ToastContainer />
          </div>
        </>}
    </>
  );
}

export default User;


