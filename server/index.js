require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
<<<<<<< HEAD
supabase = require("./SupabaseServer.js")
const { Configuration, OpenAIApi } = require("openai");
const path = require('path');
=======
supabase = require("./SupabaseServer.js").default
>>>>>>> e01b7f85a0f61f31060ef41dca4542213c665353



app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

<<<<<<< HEAD
app.get("/api/getTestScenarios", cors(), async (req, res) => {

  const { data, error } = await supabase
  .from('test_case')
  .select('*')


    res.json({
      tests: data
      })
  });

  app.get("/api/getTestAutomatedTests", cors(), async (req, res) => {

    const { data, error } = await supabase
    .from('automated_tests')
    .select('*')
    res.json([data])
    });

  app.post("/api/createTestScenarios", async (req, res) => {


    const requestBody = JSON.stringify(req.body);

    console.log("body: " + requestBody);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
        {"role": "system", "content": "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "},
        {"role": "user", "content":
              `User Story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.

               Test Steps:
               - A user logs into Netflix
               - Look through several potenital shows
               - Click into the show that interests me
               - Then I click on the video player
               - The user clicks the play arrow to pause the show
               - When i press the play arrow again my show will resume where it left off

               Acceptance criteria:
               Verify that when a user clicks pause, netflix will save the scene where they stopped watching the show.\nIf there is a network error when they try to pause, netflix will use the last saved index of my show and will continue from that point when they return to watch netflix.\nWhen they press play, netflix will resume the show from the same place where they paused it.
              `
        },
        {"role": "assistant", "content": `
        {
            "Test_Case_Scenarios": [
              {
                "scenario_type": "Happy Path",
                "test_case": "If a user fast forwards through a tv show and pauses, Netflix will save the index where the user paused successfully"
              },
              {
                "scenario_type": "Non-Happy Path",
                "test_case": "If a user is playing a show at regular speed and pauses the show, Netflix will save the index where the user paused successfully"
              },
              {
                "scenario_type": "Non-Happy Path",
                "test_case": "If a user exits Netflix without clicking the pause button, Netflix will save the index and video frame where the user last watched successfully."
              },
              {
                "scenario_type": "Non-Happy Path",
                "test_case": "If a user rewinds through a tv show and pauses, Netflix will save the index where the user paused successfully."
              }
            ]
          }`},
        {"role": "user", "content": requestBody}
        ],
        temperature: 0.2,
    });
    console.log(completion.data.choices[0].message);
    res.json({
        result: completion.data.choices[0].message
        })
=======
>>>>>>> e01b7f85a0f61f31060ef41dca4542213c665353

app.use("/api/v1/", require("./routes/testRoute"));

<<<<<<< HEAD
})

app.post("/api/saveTestScenarios", async (req, res) => {

  console.log("body: " + JSON.stringify(req.body));

  const { data, error } = await supabase
  .from('test_case')
  .insert(
    req.body
  )

  console.log("error: " + JSON.stringify(error));
  console.log("data: " + JSON.stringify(data));


  res.json({
    result: "saved"
    })
})



  if (process.env.NODE_ENV === 'production') {

    // Exprees will serve up production assets
    if (process.env.NODE_ENV === 'production') {
      // Express will serve up production assets
      app.use(express.static('../client/.next'));

      // Express serve up index.html file if it doesn't recognize the route
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
      });
    }

  }
  app.listen(process.env.PORT || 5000, () => { console.log("server started on port 5000")})
=======
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  const path = require('path');

  app.use(express.static(path.join(__dirname, '../client/out')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/out', 'index.html'));
  });
}
app.listen(process.env.PORT || 5000, () => { console.log("server started on port 5000")})
>>>>>>> e01b7f85a0f61f31060ef41dca4542213c665353
