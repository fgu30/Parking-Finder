const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const middlewares = require('./middlewares');
const mongoose = require('mongoose');
const logs = require('./api/logs');



require('dotenv').config();


const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json()); // support json encoded bodies

app.get("/", function (req, res) {
    res.json({
        status: "My API is alive!"
    });
});

app.use("/api/logs", logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`The server is Listening to http://localhost:${port}`)
});