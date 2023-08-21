const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateTestCases = async (req, res) => {
  try {
    const {user_story_details, acceptance_criteria, test_steps} = req.body;
    var formatted_steps = "";
    // Creating the formatted string
    for (var i = 0; i < test_steps.length; i++) {
      formatted_steps += "- " + test_steps[i] + "\n";
    }
    console.log("formated steps", formatted_steps);
    const requestBody = `
    User Story: ${user_story_details}

    Test Steps:
    ${formatted_steps}
    
    Acceptance criteria:
    ${acceptance_criteria}
    `;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "
        },
        {
          role: "user",
          content: `User Story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.

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
        {
          role: "assistant",
          content: `
                {
                    "Test_Case_Scenarios": [
                      {
                        "scenario_type": "",
                        "test_case": ""
                      }
                    ]
                 }`
        },
        {
          role: "user",
          content: requestBody
        }
      ],
      temperature: 0.2
    });
    // console.log("completion", completion.data.choices[0].message)
    res.json({result: completion.data.choices[0].message});
  } catch (err) {
    console.log("Error while generating test cases:", JSON.stringify(err));
    res.json({err: err, status: 500});
  }
};

export default generateTestCases;
