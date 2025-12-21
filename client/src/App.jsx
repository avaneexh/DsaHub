import { useState, useEffect } from 'react'
import { Toaster } from "react-hot-toast";
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage  from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";
import Layout from './layout/Layout';
import AdminRoute from './components/AdminRoute';
import AddEditProblem from './components/AddEditProblem';
import Dashboard from './pages/Dashboard';
import ProblemPage from './pages/ProblemPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetail from './components/PlaylistDetail';
import ProfilePage from './pages/ProfilePage';
import { useProblemStore } from './store/useProblemStore';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {getSolvedProblemByUser, getAllProblems, isProblemsLoading, isAllProblemsCountLoading } = useProblemStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth ) {
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
            element={authUser ? <Navigate to="/dashboard"/> : <Navigate to="/lander"/>}
          />
          <Route
            path = '/dashboard'
            element={authUser ? <Dashboard/> : <Navigate to="/login"/>}
          />
          <Route
            path = '/profile'
            element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}
          />
          <Route
            path = '/playlists'
            element={authUser ? <PlaylistsPage/> : <Navigate to="/login"/>}
          />
          <Route
            path = '/playlist/:playlistId'
            element={authUser ? <PlaylistDetail/> : <Navigate to="/login"/>}
          />
        </Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/lander"
          element={<HomePage />}
        />

        
        <Route element={<AdminRoute />}>
          <Route
            path="/addProblem"
            element={authUser ? <AddEditProblem /> : <Navigate to="/" />}
          />
        </Route>
        
      </Routes>
    </div>
  )
}

export default App
