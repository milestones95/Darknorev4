require('dotenv').config();
require = require("esm")(module/*, options*/)
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
supabase = require("./SupabaseServer.js")
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');


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


    console.log('data: ', data);
    res.json({
      tests: data
      })
  });

  app.get("/api/viewTests", cors(), async (req, res) => {

    let { data, error } = await supabase
    .rpc('gettestcases')

    if (error) console.error(error)
    else console.log(data)
  
  
      res.json({
        tests: data
        })
    });

  app.post("/api/createTestScenarios", async (req, res) => {


    const requestBody = JSON.stringify(req.body);
    console.log("hello i'm here scenarios!!!!")


    console.log("body: " + requestBody);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
        {"role": "system", "content": "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "},
        {"role": "user", "content": "User story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.\nAcceptance criteria:\nWhen I click pause, netflix will save the scene where I stopped watching the show.\nIf there is a network error when I try to pause, netflix will use the last saved index of my show and will continue from that point when I return to watch netflix.\nWhen I press play, netflix will resume the show from the same place when I paused it."},
        {"role": "assistant", "content": "'Test Case Scenarios':{'scenario_type':'Happy Path', 'test_case':'If a user fast forwards through a tv show and pauses, netflix will save the index where the user paused successfully'}, {'scenario_type': 'Non-Happy Path','test_case': 'If a user is playing a show at regular speed and pauses the show, netflix will save the index where the user paused successfully'},{'scenario_type': 'Non-Happy Path', 'test_case': If a user exits netflix without clicking the pause button, netflix will will save the index and video frame where the user last watched successfully.'}\nIf a user rewinds through a tv show and pauses, netflix will save the index where the user paused successfully.'}"},
        {"role": "user", "content": requestBody}
        ],
        temperature: 0.2,
    });
    console.log(completion.data.choices[0].message);
    res.json({
        result: completion.data.choices[0].message
        })


})

app.post("/api/generateAutomatedTests", async (req, res) => {
  const requestBody = JSON.stringify(req.body);

  try {
    // Make an HTTP POST request to your Python API
    // const response = await axios.post('http://localhost:8000/api/getHtmlBodies', requestBody, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    // // Process the response from the Python API
    // const responseData = response.data;
    // console.log('Response from Python API:', response);

    const testObject = {
      "testSteps": [
        {
          "id": "06b7b934-3acf-4287-a081-cfd4136fdbc0",
          "testStep": "click contact us button",
          "webpage": "https://www.darknore.com/",
          "html": "<a class=\"button cp-button w-button\" href=\"/darknore-quote-form\">Contact Us</a></div>"
        },
        {
          "id": "06b7b934-3acf-4287-a081-cfd4136fdba3",
          "testStep": "fill out form with name and email fields",
          "webpage": "https://www.darknore.com/darknore-quote-form",
          "html": "<form data-name=\"Darknore Form\" data-wf-element-id=\"c6e8a98d-c7ea-aac4-635e-c08eba40f6a3\" data-wf-page-id=\"63a76722c7b14482b016ab7e\" id=\"wf-form-Darknore-Form\" method=\"get\" name=\"wf-form-Darknore-Form\"><label for=\"name\">Name</label><input class=\"w-input\" data-name=\"name\" id=\"name\" maxlength=\"256\" name=\"name\" placeholder=\"\" required=\"\" type=\"text\"/><label for=\"email\">Email Address</label><input class=\"w-input\" data-name=\"Email\" id=\"email\" maxlength=\"256\" name=\"email\" placeholder=\"\" required=\"\" type=\"email\"/><input class=\"w-button\" data-wait=\"Please wait...\" id=\"submit-inquiry\" type=\"submit\" value=\"Submit\"/></form><div class=\"w-form-done\"><div>Thank you! Your submission has been received!</div></div>"
        }
      ]
    };
    
    console.log("stringify test object: " + JSON.stringify(testObject));
    
    // console.log("response scenarios: " + JSON.stringify(response.data.scenarios[0]));
    
    const systemMessage = {
      "role": "system",
      "content": "You are an assistant who is an SDET that writes automated UI tests in Selenium and C#. You read the test case description and then look at the list of test steps. You use those test steps to convert into code in order to complete a UI test case. You avoid using XPath to find elements and first try to use element ID or name. Using XPath to get an element is your last resort. The response should only consist of source code."
    };
    
    const userMessages = [
      {
        "role": "user",
        "content": "Here is the scenario: As a user, I can submit my contact information to the form on my website. The form consists of only a name field and an email field."
      }
    ];
    
    let concatenatedResponses = ""; // Variable to store concatenated responses
    
    // Loop through each individual test step
    for (const testStep of testObject.testSteps) {
      const apiInput = {
        messages: [
          systemMessage,
          ...userMessages,
          {
            "role": "user",
            "content": JSON.stringify(testStep)
          }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.5
      };
    
      console.log("object defined");
    
      try {
        const completion = await openai.createChatCompletion(apiInput);
        const response = completion.data.choices[0].message.content;
        console.log("Response for test step: " + testStep.testStep + "\n" + response);
    
        concatenatedResponses += response + "\n"; // Concatenate the response with a newline separator
      } catch (error) {
        console.error('API error:', error.response.data);
      }
    }
    
    console.log("Concatenated Responses: " + concatenatedResponses);
    
    // Handle the concatenated responses here
    




    // Assign the response to the 'code' property in the current scenario object
    // testObject.code = gptResponse;
    // console.log('code: ', testObject.code);
    // Loop through scenarios and call the API for each scenario
    // for (let i = 0; i < responseData.scenarios.length; i++) {
    //   const scenario = responseData.scenarios[i];

    //   console.log("scenario: ", scenario);
    //   const apiInput = {
    //     messages: [
    //       {"role": "system", "content": "You are an assistant who is an SDET that writes automated UI tests in Selenium and C#. You avoid using XPath to find elements and first try to use element ID or name. Using XPath to get an element is your last resort. The response should only consist of source code."},
    //       {"role": "user", "content": "Here is the scenario: " + JSON.stringify(scenario)}
    //     ],
    //     model: "gpt-3.5-turbo",
    //     temperature: 0.5
    //   };

    //   // Make API call for the current scenario
    //   const completion = await openai.createChatCompletion(apiInput);
    //   const response = completion.data.choices[0].message.content;

    //   // Assign the response to the 'code' property in the current scenario object
    //   scenario.code = response;
    //   console.log('code: ', scenario.code);

    //   // Delay for 1 second before processing the next scenario
    //   if (i < responseData.scenarios.length - 1) {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //   }
    // }

    // res.json({
    // result: completion.data.choices[0].message
    // })
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/api/createTestCases", async (req, res) => {

  try {
    for (const testCase of req.body) {
      const { data, error } = await supabase
        .from('test_case')
        .insert([
          {
            content: testCase.content,
            // Include other properties here if necessary
          }
        ]);

      if (error) {
        console.error('Error inserting test case:', error.message);
      } else {
        console.log('Test case inserted successfully:', data);
        //get id then do another insert into automated_test table

        const { data2, error2 } = await supabase
        .from('automated_test')
        .insert([
          {
            test_case_id: "test case id",//Change this to the real id
            content: testCase.test_content,
            // Include other properties here if necessary
          }
        ]);
      }
    }
  } catch (error) {
    console.error('Error inserting test cases:', error.message);
  }


  res.json({
    result: "saved"
    })
})

app.post("/api/saveTestScenarios", async (req, res) => {

  console.log("body: " + JSON.stringify(req.body));

  const { data, error } = await supabase
  .from('test_case')
  .insert(
    req.body
  )

  // //Get the id of the test case scenario

  // const { test_cases, error } = await supabase
  // .from('test_case')
  // .insert(
  //   req.body
  // )

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
