import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemLoading: false,
  isProblemsLoading: false,
  isAllProblemsCountLoading: false, 
  allProblemsCount : 0,
  solvedProblemsCount : 0,
  

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const response = await axiosInstance.get(`/problems/getAllProblem`);
      set({ problems: response.data.problems });
    } catch (error) {
      set({ isProblemsLoading: false });
      toast.error("Failed to fetch problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const response = await axiosInstance.get(`/problems/getProblemById/${id}`);
      set({ problem: response.data.problem });
    } catch (error) {
      set({ isProblemLoading: false });
      toast.error("Failed to fetch problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

 
  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/getSolvedProblem");
      const { solvedProblems, totalProblems } = res.data.counts;

      // console.log("Solved problems:", solvedProblems, totalProblems );
      set({allProblemsCount: totalProblems,solvedProblemsCount: solvedProblems,});
    } catch (error) {
      console.log("Error getting solved problems", error);
      // toast.error("Error getting solved problems");
    }
  },
}));