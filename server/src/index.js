import express from "express";
import  dotenv  from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"
import { initCollabSocket } from "./socket/collab.socket.js";
import http from "http";

import authRoutes from "./Routes/auth.routes.js";
import problemRoutes from "./Routes/problem.routes.js";
import executionRoutes from "./Routes/code-execution.routes.js";
import submissionRoutes from "./Routes/submission.routes.js";
import playlistRoutes from "./Routes/playlist.route.js";


dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dsahub.onrender.com",
    ],
    credentials: true
  })
);

app.get("/", (req, res) =>{
    res.send("Hello From DsaHub🔥🔥")
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execution", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

const server = http.createServer(app);

initCollabSocket(server);

app.listen(process.env.PORT, ()=> {
    console.log("Server is running on port 8000")
})