import express from "express";
import {authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, editProblem, getProblem, getProblemById, getSolvedProblem } from "../controllers/problemController/problem.Controller.js";


const problemRoutes = express.Router();

problemRoutes.post("/createProblem", authMiddleware, checkAdmin, createProblem);
problemRoutes.get("/getAllProblem", authMiddleware, getProblem);
problemRoutes.get("/getProblemById/:id", authMiddleware, getProblemById);
problemRoutes.put("/editProblem/:id", authMiddleware, editProblem);
problemRoutes.delete("/deleteProblem/:id", authMiddleware, checkAdmin, deleteProblem);
problemRoutes.get("/getSolvedProblem", authMiddleware, getSolvedProblem);

export default problemRoutes;