import express from "express";
import  dotenv  from "dotenv";
import cookieParser from "cookie-parser"


import authRoutes from "./Routes/auth.routes.js";


dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) =>{
    res.send("Hello From DsaHub🔥🔥")
})

app.use("/api/v1/auth", authRoutes);



app.listen(process.env.PORT, ()=> {
    console.log("Server is running on port 8000")
})