const express = require('express');
const userRouter = require('./routers/users');
const gameRouter = require('./routers/games');
const cors = require('cors');

require('dotenv').config();
    
const app = express();
const port = process.env.API_PORT || 8080;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`[${req.ip}]: ${req.method} ${req.url}`);
    next();
});

app.use('/users', userRouter);
app.use('/games', gameRouter);

app.get('/', (req, res) => {
    res.send({message: 'API running'});
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
