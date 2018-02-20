import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import dotenv from "dotenv";
import auth from "./routes/auth";


dotenv.config();
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL);

app.use("/api/auth", auth);

app.get('/*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT, () => console.log(`Running on localhost:${process.env.PORT}`));

