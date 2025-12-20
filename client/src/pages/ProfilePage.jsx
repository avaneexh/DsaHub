import React, { useEffect } from "react";
import UserCard from "../components/UserCard";
import SubmissionHeatmap from "../components/SubmissionHeatmap";
import { useAuthStore } from "../store/useAuthStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { Loader } from "lucide-react";

const ProfilePage = () => {
  const { isCheckingAuth } = useAuthStore();
  const { getAllSubmissions } = useSubmissionStore();

  useEffect(() => {
    getAllSubmissions();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="size-10 animate-spin text-neutral-700 dark:text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 px-4 py-10">
        <UserCard page="profile" />
        <SubmissionHeatmap />
      </div>
    </div>
  );
};

export default ProfilePage;
