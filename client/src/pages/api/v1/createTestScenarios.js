const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Create test Scenarios
const createTestScenarios = async (req, res) => {
    // console.log(req);
      const requestBody = JSON.stringify(req.body);
    
      console.log("body: " + requestBody);
      try {
      const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages:[
          {"role": "system", "content": "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "},
          {"role": "user", "content": "User story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.\nAcceptance criteria:\nWhen I click pause, netflix will save the scene where I stopped watching the show.\nIf there is a network error when I try to pause, netflix will use the last saved index of my show and will continue from that point when I return to watch netflix.\nWhen I press play, netflix will resume the show from the same place when I paused it."},
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
        } catch (error) {
            console.log(error);
            res.json({error: error.message})
        }
    
    
  }
  export default createTestScenarios;