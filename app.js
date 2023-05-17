import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import storyRoutes from './routes/stories.js'
import userRoutes from './routes/users.js'
import dotenv from "dotenv";
//const express = require('express')

const app = express();
dotenv.config()

app.use(bodyParser.json({ limit: "32mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());

app.use("/stories", storyRoutes);
app.use("/user", userRoutes);

//const MONGO_URI = "mongodb+srv://instaverse:instaverse@cluster0.mjsqwcg.mongodb.net/?retryWrites=true&w=majority";
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    }catch (err) {
        console.error("Connection to MongoDB failed", err.message)
    }
}

connectDB();
mongoose.connection.on("open", () => console.log("Connection to database has been established successfully"));
mongoose.connection.on("error", (err) => console.log(err));