// 📢 socket.emit = Client → Server

// Client (browser) server ko message bhej raha hai.

// ✅ Frontend (client)

// socket.emit("send-message", { text: "Hello" });

// ✅ Backend (server)

// socket.on("send-message", (data) => {
//   console.log("Client ne message bheja:", data);
// });


//  📢 io.emit = Server → All Clients

// Server sab connected clients ko ek saath message bhej raha hai.


// ✅ Backend

// io.emit("new-user-joined", userData); // broadcast to all clients

// ✅ Frontend (sab clients)

// socket.on("new-user-joined", (userData) => {
//   console.log("Naya user aya:", userData);
// });


// Ek specific client ko message bhejna:

// io.to(socketId).emit("receive-message", data);


import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/DB.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 4000;


// initialize socket.io

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  }
});


// store online users

export const userSocketMap = {}   // {userId : socketId}

// connection handler

// 📌 Jab bhi koi client (browser) Socket.IO se connect karta hai, 
// to ye function run hota hai.

// socket = wo particular client jo connect hua hai.

io.on("connection",(socket) => {
//    Jab user socket se connect karta hai, to frontend
//    se userId bhejta hai query string ke through.

//   Example: io("http://localhost:4000", { query: { userId: "abc123" } })
   const userId = socket.handshake.query.userId;
   console.log("User connected: " + userId)
   if(userId){
    userSocketMap[userId] = socket.id;
   }
   // Emit online users to all connected clients
   io.emit('getOnlineUsers',Object.keys(userSocketMap)) 

//    📌 Jab user tab close karta hai ya internet chala jata hai, 
//    to disconnect event trigger hota hai.

   socket.on('disconnect',()=>{
     console.log("User disconnected: " + userId)
     delete userSocketMap[userId];
     io.emit('getOnlineUsers' , Object.keys(userSocketMap))
   })
})


// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));


const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173'  
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token']
}));


// DB connection
await connectDB();

// Routes
app.use("/api/auth", userRouter);

app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("API is working");
});

// development
if(process.env.NODE_ENV !== "production"){
  server.listen(PORT, () => {
    console.log("Server is listening on PORT:", PORT);
  });
}
//for vercel
export default server