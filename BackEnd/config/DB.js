import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected",()=>{
            console.log("DB Connected");
        })
        await mongoose.connect(`${process.env.MONGO_URL}/Chat_App`)
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};
