const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const generateTestCases = async (req, res) => {
  try {
    const requestBody = JSON.stringify(req.body);
    console.log("body: " + requestBody);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that is a quality assurance tester. Your task is to create test case scenarios for based on a product’s user story and the acceptance criteria. The test case scenarios should include happy paths and nonhappy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "
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
        {role: "user", content: requestBody}
      ],
      temperature: 0.2
    });
    res.json({result: completion.data.choices[0].message});
  } catch (err) {
    console.log(
      "🚀 ~ file: generateTestCases.js:7 ~ generateTestCases ~ err:",
      JSON.stringify(err)
    );
    res.json({err: err, status: 500});
  }
};
export default generateTestCases;
