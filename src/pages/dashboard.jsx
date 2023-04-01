import Table from './table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import { useAuth } from '../Context/Auth';


function Dashboard(){
    const navigate = useNavigate();
    const [login, setLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const {curUser, getUser} = useAuth();
    async function checkRole(){
      // let user = await getUser();
      if(!curUser){
        navigate('/login')
      }
      if(curUser?.role === 'Staff'){
        // console.log(user)
        navigate(`/profile/`+curUser?._id)
      }
      else if(curUser?.role == 'CompOper'){
        navigate('/addReport')
      }
    }
    useEffect(()=>{
      checkRole();
      console.log(curUser)
    },[])
    return(
        <>
        <NavBar user={curUser}/>
        <div className="table">
        {curUser && curUser?.role !== 'CompOper' && curUser?.role !== 'Staff' && <Table /> }
        </div>
        </>
    )
}

export default Dashboard
