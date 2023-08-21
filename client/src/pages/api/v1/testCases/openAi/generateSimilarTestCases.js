const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateSimilarTestCases = async (req, res) => {
  try {
    const {test_case, scenario_type} = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that is a quality assurance tester. Your task is to create detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test the similar things as the one given to you by a user. These test cases scenarios should tests similar things and test case scenarios should be the same type as the one given to you by the user these types are happy paths, non-happy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "
        },
        {
          role: "assistant",
          content: `
              {
                  "Test_Case_Scenarios": [
                    {
                      "scenario_type": "scenerio_type",
                      "test_case": "test_case"
                    }
                  ]
              }`
        },
        {
          role: "user",
          content: `
            Can you make at least 5 detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
            {
              "Test_Case_Scenarios":
              [
                {
                  "scenario_type": ${scenario_type},
                  "test_case": ${test_case}
                }
              ]
            }
          `
        }
      ],
      temperature: 0.2
    });
    res.json({result: completion.data.choices[0].message});
  } catch (err) {
    console.log("Error while generatin similar test cases:", JSON.stringify(err));
    res.json({err: err, status: 500});
  }
};
export default generateSimilarTestCases;
