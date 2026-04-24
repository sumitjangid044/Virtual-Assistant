import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import express from "express"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import chatgptResponse from "./chatgpt.js"



const app = express()
app.use(cors({
    origin:"https://virtual-assistant-qz5f.onrender.com",
    credentials:true
}))
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user", userRouter)



app.listen(port,()=>{
    connectDb()
    console.log("Server Started")
})
