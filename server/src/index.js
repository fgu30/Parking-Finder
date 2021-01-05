const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const middlewares = require('./middlewares');





const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.get("/", function (req, res) {
    res.json({
        status: "My API is alive!"
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`The server is Listening to http://localhost:${port}`)
});