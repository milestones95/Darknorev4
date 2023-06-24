require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
supabase = require("./SupabaseServer.js")
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/getTestScenarios", cors(), async (req, res) => {

  const { data, error } = await supabase
  .from('test_case')
  .select('*')


    res.json({
      tests: data
      })
  });

  app.post("/api/createTestScenarios", async (req, res) => {

  
    const requestBody = JSON.stringify(req.body);

    console.log("body: " + requestBody);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
        {"role": "system", "content": "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "},
        {"role": "user", "content": "User story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.\nAcceptance criteria:\nWhen I click pause, netflix will save the scene where I stopped watching the show.\nIf there is a network error when I try to pause, netflix will use the last saved index of my show and will continue from that point when I return to watch netflix.\nWhen I press play, netflix will resume the show from the same place when I paused it."},
        {"role": "assistant", "content": "Test Case Scenarios:\nHappyPath:If a user fast forwards through a tv show and pauses, netflix will save the index where the user paused successfully.\nIf a user is playing a show at regular speed and pauses the show, netflix will save the index where the user paused successfully.\nIf a user exits netflix without clicking the pause button, netflix will will save the index and video frame where the user last watched successfully.\nIf a user rewinds through a tv show and pauses, netflix will save the index where the user paused successfully.\nIf a user rewinds through a tv show and but never pauses the show, but instead just exits netflix, netflix will index where the user last watched before they started rewinding the show. HappyPath:If a user is playing a show at regular speed and pauses the show, netflix will save the index where the user paused successfully. HappyPath:If a user exits netflix without clicking the pause button, netflix will will save the index and video frame where the user last watched successfully."},
        {"role": "user", "content": requestBody}
        ],
        temperature: 0.2,
    });
    console.log(completion.data.choices[0].message);
    res.json({
        result: completion.data.choices[0].message
        })
  
  
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
    app.use(express.static('../client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
  }
  app.listen(process.env.PORT || 5000, () => { console.log("server started on port 5000")})