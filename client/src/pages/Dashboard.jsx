import React, {useEffect} from 'react'
import UserCard from '../components/UserCard'
import { useProblemStore } from '../store/useProblemStore';
import { Loader } from "lucide-react";
import AllProblems from '../components/AllProblems';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  // console.log("Problems", problems);
  
  if(isProblemsLoading || isCheckingAuth){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div>
      <UserCard/>
      {
        problems.length > 0 ? <AllProblems problems={problems}/> : (
          <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
            No problems found
          </p>
        )
      }

    </div>
  )
}

export default Dashboard