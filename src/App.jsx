import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <div style={{color: "white"}}>Loading...</div>;
  }
  return(
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard"/>}/>
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard"/>}/>

        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}/>
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"}/>}/>

      </Routes>
    </Router>
  )
}

export default App;