import logo from './logo.svg';
import './App.css';
import Create from './pages/createUser';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddReport from './pages/addreport';
import Alluser from './pages/alluser';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Nvbr';
import { useState, useEffect } from 'react';
import api from './pages/api';
import Profile from './pages/profile';
import { AuthProvider } from './Context/Auth';
function App() {
  const [login, setLogin] = useState(false)
  const [user, setUser] = useState();
  return (
    <>
      <Router>
        <AuthProvider>
          <div className="App container">
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path='/create' element={<Create />} />
              <Route path='/login' element={<Login />} />
              <Route path='/addreport' element={<AddReport />} />
              <Route path='/profile/:userId' element={<Profile />} />
              <Route path='/alluser' element={<Alluser />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
