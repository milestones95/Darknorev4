// const supabase = require("../../SupabaseServer.js");
const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateSimilarTestCases = async (req, res) => {
  console.log("🚀 ~ file: generateSimilarTestCases.js:10 ~ generateSimilarTestCases ~ req:", req)
  try {
    const {user_story, acceptance_criteria, test_case} = req.body;
    const testCase = {
        Test_Case: test_case
      };
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
          content: `User story: ${user_story}. Acceptance criteria: ${acceptance_criteria}`
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
          content: `Generate more test cases similar to the ${JSON.stringify(
            testCase
          )}`
        }
      ],
      temperature: 0.2
    });
    res.json({result: completion.data.choices[0].message});
  } catch (err) {
    res.json({err: err, status: 500});
  }
};
export default generateSimilarTestCases;
