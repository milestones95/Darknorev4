require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
// const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware



// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/v1/", require("./routes/testRoute.js"));
module.exports = app;