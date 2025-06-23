import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/Chat_App`, {
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000, 
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1); 
    }
};

mongoose.connection.on("connected", () => {
    console.log("🟢 Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.error("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("🟡 Mongoose disconnected from DB");
});

// Optional: Handle process termination
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination");
    process.exit(0);
});

export default connectDB;