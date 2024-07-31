import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import connectMongoDB from "./Db/connectMongoDb.js";

// MODELS
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const app = express();

app.use(express.json());// to parse req.body
app.use(express.urlencoded({extended: true})); // to parse from data
app.use(cookieParser());// to check the cookie

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

const port = process.env.PORT;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectMongoDB();
});
