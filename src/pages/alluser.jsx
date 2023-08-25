import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { Box, Card, CardContent, Grid, IconButton, LinearProgress, Modal, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../Context/Auth';
import './login.css'
import api from './api'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

const columns: GridColDef[] = [
  {
    field: 'fname',
    headerName: 'Name',
    width: 250
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 180,
  },
  {
    field: 'store',
    headerName: 'Store',
    width: 180,
  },

  {
    field: 'number',
    headerName: 'Number',
    width: 180,
  },
  {
    field: 'username',
    headerName: 'Email',
    width: 250,
  }
];

function CustomToolbar() {
  return (
    <GridToolbarExport />
  );
}

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
  const [tableLoad, setLoad] = useState(false);
  const { curUser, getUser } = useAuth();
  async function checkRole(){
    // let user = await getUser();
    if(curUser?.role === 'Staff'){
      // console.log(curUser)
      navigate(`/profile/`+curUser?._id)
    }
    else if(curUser?.role == 'CompOper'){
      navigate('/addReport')
    }
  }
  const fetchAlluser = async () => {
    setLoad(true)
    const users = await api.get(`/user/alluser`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': document.cookie
        },
      });
    // console.log(users);
    if (users.status === 200) {
      setUsers(users.data.users.map(e => {
        if (e.fname) e.fname = `${e.fname} ${e.lname}`
        return { ...e }
      }))
    }
    setLoad(false)
  }


  const deleteUser = async (id) => {
    try {
      const res = await api.delete(`/user/${id}/delete`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

          },
          data: {
            header: document.cookie
          }
        });
      // console.log(res);
      if (res.status === 200) {
        if (res.data.res) {
          toast.success("User Deleted successfully", {
            position: "top-center",
          }
          );
          fetchAlluser();

        }
        else {
          toast.warn("User not found", {
            position: "top-center",
          })
        }
        handleClose();
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
   checkRole();
   fetchAlluser();
  }, [])

  return (
    <>
      {loading && <LinearProgress />}
      {!loading && curUser &&
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
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }} align='center' >
                <Button align='center' variant='contained' color='error' onClick={() => { deleteUser(delUser) }}>Delete</Button>
              </Typography>
            </Box>
          </Modal>
          <NavBar user={curUser} />
          <div className="shadow  container p-4">
            <h1 style={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Apple Color Emoji',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>Employees</h1>
            <Box>
              <DataGrid
                isRowSelectable={true}
                autoHeight
                getRowId={(row) => row._id}
                rows={users}
                columns={columns}
                onRowClick={(params, event) => {
                  if (!event.ignore) {
                    navigate(`/profile/${params.id}`)
                  }
                }}
                pageSize={10}
                rowsPerPageOptions={[10]}
                loading={tableLoad}
                experimentalFeatures={{ newEditingApi: true }}
                components={{ Toolbar: GridToolbarExport }}
              />
            </Box>
            <ToastContainer />
          </div>
        </>}
    </>
  );
}

export default User;


