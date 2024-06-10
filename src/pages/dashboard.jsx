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
      if(curUser?.role === 'Staff' || curUser?.role === 'Store Associate' || curUser?.role === 'Senior Store Associate'){
        // console.log(user)
        navigate(`/profile/`+curUser?._id)
      }
      else if(curUser?.role == 'BillingAssociate'  || curUser?.role === 'Billing Associate'){
        navigate('/addReport')
      }
    }
    useEffect(()=>{
      checkRole();
      // console.log(curUser, "Cur") 
    },[])
    return(
        <>
        <NavBar user={curUser}/>
        <div className="table">
        {curUser && !["Billing Associate", "Store Associate", "Senior Store Associate", "BillingAssociate", "Staff"].includes(curUser?.role) && <Table /> }
        </div>
        </>
    )
}

export default Dashboard
