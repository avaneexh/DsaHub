import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Toast } from "./useToastStore";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemLoading: false,
  isProblemsLoading: false,

  getProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const response = await axiosInstance.get(`/problems/getAllProblem`);
      set({ problems: response.data.problems });
    } catch (error) {
      set({ isProblemsLoading: false });
      Toast.error("Failed to fetch problems");
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
      Toast.error("Failed to fetch problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const response = await axiosInstance.get(`/problems/getSolvedProblem`);
      set({ solvedProblems: response.data.problems });
    } catch (error) {
      set({ isProblemsLoading: false });
      Toast.error("Failed to fetch solved problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      console.log("Solved problems:", res.data);
      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting solved problems", error);
      Toast.error("Error getting solved problems");
    }
  },
}));