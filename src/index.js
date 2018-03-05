import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Promise from 'bluebird';
import router from "./routes";


dotenv.config();
const app = express();
app.use(bodyParser.json());

// using bluebird promise
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);

router(app);

app.get('/*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT, () => console.log(`Running on localhost:${process.env.PORT}`));

