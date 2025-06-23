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

// Initialize HTTP server and Socket.IO
const server = http.createServer(app);


// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  }
});

// Online users tracking
export const userSocketMap = {};

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);
  
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log("User disconnected:", userId);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// CORS configuration

const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173'  
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    // API Routes
    app.use("/api/auth", userRouter);
    app.use("/api/messages", messageRouter);

    // Health check endpoint
    app.get("/", (req, res) => {
      res.send("🚀 Chat App API is running");
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`⚡ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();

// Export for Vercel
export default app;