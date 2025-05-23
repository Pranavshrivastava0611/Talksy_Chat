import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Routes ,Route , Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Setting from './pages/Setting'
import SignUp from './pages/Signup'
import Profile from './pages/Profile'
import ErrorPage from './pages/ErrorPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'



function App() {
  const routeCheck = ["signup","login","profile","settings"];
  const [checkRoute,setCheckRoute] = useState();
  const {pathname} = useLocation();
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();
  console.log("online users are", onlineUsers);

  useEffect(()=>{
    checkAuth();
    if(routeCheck.indexOf(pathname.slice(1))=== -1 && pathname!=="/"){
      setCheckRoute(false);
    }else{
      setCheckRoute(true);
    }
  },[]);
  useEffect(()=>{
    console.log("authuser is ready to be printed" , authUser)
  },[authUser])

  if(isCheckingAuth && !authUser){
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loader className='animate-spin size-10'/>
      </div>
    )
  }

  return (
    <>
    <div data-theme={theme}>
    <Navbar/>
    { checkRoute ?
    <Routes>
    <Route path='/' element={ authUser ? <HomePage data-theme={theme}/> : <Navigate to="/login"/>}/>
    <Route path='/signup' element={!authUser ? <SignUp/> : <Navigate to={"/"}/>}/>
    <Route path='/login' element={!authUser ? <Login/> : <Navigate to={"/"}/>}/>
    <Route path='/settings' element={<Setting/>}/>
    <Route path='/profile' element={authUser ? <Profile/> : <Navigate to={"/login"}/>}/>
    </Routes>
: <ErrorPage/>}
    <Toaster/>
    </div>
    </>
  )
}

export default App
