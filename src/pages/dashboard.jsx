import Table from './table'
import api from './api'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Nvbr';
import Skeleton from '../skeleton/dashboard';


function Dashboard(){
    const navigate = useNavigate();
    const [login, setLogin] = useState(false)
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false)
    const fetchUser = async () => {
        try {
            setLoading(true)
            console.log(document.cookie)
          const res = await api.post('/user/userPro',{header: document.cookie},{ withCredentials: true });
          console.log(res);
          if(!res.data.user){
            navigate('/login')
          }
          else{
            setUser(res.data.user)
            if(res.data.user.role === 'Staff'){
              navigate('/profile')
            }
            else if(res.data.user.role === 'CompOper'){
              navigate('/addReport')
            }
            setLogin(true)
          }
          setLoading(false)
        }
        catch (e) { console.log(e) }
      }
      useEffect(() => {
        fetchUser();
      }, [])
    return(
        <>
        <NavBar user={user}/>
        <div className="table">
        {login && <Table /> }
        </div>
        </>
    )
}

export default Dashboard
