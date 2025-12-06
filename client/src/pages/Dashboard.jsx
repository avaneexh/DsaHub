import React, {useEffect} from 'react'
import UserCard from '../components/UserCard'
import { useProblemStore } from '../store/useProblemStore';
import { Loader } from "lucide-react";

const Dashboard = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  console.log("Problems", problems);
  

  if(isProblemsLoading){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div>
      <UserCard/>
    </div>
  )
}

export default Dashboard