import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { io, server,app } from "./lib/socket.js"
import path from "path"
dotenv.config()
app
//app.use(express.json())
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

const PORT=process.env.PORT
const __dirname = path.resolve();
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
    );
}
server.listen(PORT,()=>{
    console.log("server is runnign on port 5001")
    connectDB()
})