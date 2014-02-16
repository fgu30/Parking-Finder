const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const logs = require("./api/logs");
const meters = require("./api/meters");
const middlewares = require("./middlewares");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(morgan("common"));
app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(express.json()); // support json encoded bodies

app.get("/", (req, res) => {
    res.json({
        status: "My API is alive!",
    });
});

app.use("/api/logs", logs);
app.use("/api/meters", meters);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2001;

app.listen(port, () => {
    console.log(`the server is listening at ${port}`);
});
