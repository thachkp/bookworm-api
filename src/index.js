import express from 'express';
import path from 'path';

const app = express();
const PORT = 8000;

app.post('/api/auth', (req, res) => {
    console.log("POST REQUEST");
    res.status(400).json(
        {errors: {global: "Invalid credentials"}}
    );
});

app.get('/*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));

