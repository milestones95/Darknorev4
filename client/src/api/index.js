require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
supabase = require("./SupabaseClient.js")



app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/v1/", require(".././server/routes/testRoute"));
module.exports = app;