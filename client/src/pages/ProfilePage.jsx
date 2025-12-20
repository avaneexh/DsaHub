import React from 'react'
import UserCard from '../components/UserCard'
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  if( isCheckingAuth){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  } 

  return (
    <div>
        <UserCard 
         page = "profile"
        />
    </div>
  )
}

export default ProfilePage