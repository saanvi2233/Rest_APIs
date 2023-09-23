import express from "express";
import { APP_PORT, DB_URL } from "./config/index.js";
import cors from "cors";
//const express = require("express");
//const mongoose = require("mongoose");
import errorHandler from './middlewares/errorHandler.js';
import routes from "./routes/index.js";
import mongoose from "mongoose";
import  path  from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
         

// Get the directory name using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//database connection
mongoose.connect("mongodb+srv://saanvigupta2233:74NhwqXl1qCZtLcm@cluster0.eynw4vc.mongodb.net/mydb", { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};


app.use(cors(corsOptions));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected....");
});
global.appRoot = path.resolve(__dirname);


app.use(express.urlencoded({extended:false}));
//import mongoose from 'mongoose';
app.use(express.json());
app.use("/api", routes);

app.use('/uploads',express.static('uploads'));
app.use(errorHandler);

app.listen(5000, () => console.log(`Listening on port ${5000}.`));
