import { useState, useEffect } from 'react'
import { Toaster } from "react-hot-toast";
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage  from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";
import Layout from './layout/Layout';
import AddProblem from './pages/AddProblem';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className='bg-[#f7f7f7] dark:bg-black'>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>
        <Route 
          path = '/login'
          element={!authUser ? <LoginPage/> :  <Navigate to ={"/"}/> }
        />
        <Route 
          path = '/signup'
          element={!authUser ? <SignUpPage/> : <Navigate to ={"/"}/>}
        />
        <Route 
          path = '/addProblem'
          element={authUser ? <AddProblem/> : <Navigate to ={"/login"}/>}
        />
      </Routes>
    </div>
  )
}

export default App
