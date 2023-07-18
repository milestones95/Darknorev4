require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
supabase = require("./SupabaseServer.js").default



app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/v1/", require("./routes/testRoute"));

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  const path = require('path');

  app.use(express.static(path.join(__dirname, '../client/out')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/out', 'index.html'));
  });
}
app.listen(process.env.PORT || 5000, () => { console.log("server started on port 5000")})
