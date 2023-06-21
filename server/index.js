require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
supabase = require("./SupabaseServer.js")




app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/createTestScenarios", async (req, res) => {
    console.log("test scenarios created");

    const { data, error } = await supabase
    .from('test_plan')
    .insert([
      { test_plan_name: 'test plan 1' },
    ])
  // return { data, error };

  console.log("error: " + JSON.stringify(error));
  console.log("data: " + JSON.stringify(data));



  const { data2, error2 } = await supabase
  .from('test_case')
  .insert([
    { content: 'test case 1'},
  ])
// return { data, error };

console.log("error: " + JSON.stringify(error2));
console.log("data: " + JSON.stringify(data2));


    res.json({
      result: "hello world"
      })
   
  });

app.get("/api/getTestScenarios", cors(), async (req, res) => {

  const { data, error } = await supabase
  .from('test_case')
  .select('*')


    res.json({
      tests: data
      })
  });

  if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('../client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
  }
  
  app.listen(process.env.PORT || 5000, () => { console.log("server started on port 5000")})