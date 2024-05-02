const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// get Test automated
const getTestAutomated = async (req, res) => {
  const {data, error} = await supabase.from("automated_tests").select("*");
  res.json([data]);
};

// get test case scenarios
const getTestScenarios = async (req, res) => {
  console.log("getTestScenarios has been called");
  const user_id = req.query.user_id;
  const {data, error} = await supabase
    .from("test_case")
    .select("*")
    .eq("user_id", user_id);

  res.json({
    tests: data
  });
};

// Create test Scenarios
const createTestScenarios = async (req, res) => {
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
        role: "user",
        content:
          "User story: As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again.\nAcceptance criteria:\nWhen I click pause, netflix will save the scene where I stopped watching the show.\nIf there is a network error when I try to pause, netflix will use the last saved index of my show and will continue from that point when I return to watch netflix.\nWhen I press play, netflix will resume the show from the same place when I paused it."
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
  console.log(completion.data.choices[0].message);
  res.json({
    result: completion.data.choices[0].message
  });
};

// Save Test Scenarios
const saveTestScenarios = async (req, res) => {
  console.log("body: " + JSON.stringify(req.body));
  const {data, error} = await supabase.from("test_case").insert(req.body);

  res.json({
    result: "saved"
  });
};

const updateCompanyName = async (req, res) => {
  console.log("body: " + JSON.stringify(req.body));
  const {data, error} = await supabase.from("updateCompanyName").insert(req.body);

  res.json({
    result: "saved"
  });
};

const getUserTestResults = async (req, res) => {
  try {
    const {id} = req.query;
    const {data, error} = await supabase
      .from("getUserTestResults")
      .select()
      .eq("user_id", id)
      .single();

    if (error) {
      console.log("getUserTestResults, Error: ", JSON.stringify(error));
      return res.json({err: error});
    }
    if (data) {
      res.json({data});
    }
  } catch (err) {
    console.log("Error while getting user result by id:", err);
    res.json({err});
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const {user_id} = req.query;
    const {data, error} = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error) {
      console.log("getCurrentUser Error: ", JSON.stringify(error));
      return res.json({err: error});
    }
    if (data) {
        console.log("getCurrentUser Data --> ", data);
      res.json({data});
    }
  } catch (err) {
    console.log("Error while getting user ", err);
    res.json({err});
  }
};

module.exports = {
  getTestAutomated,
  getTestScenarios,
  createTestScenarios,
  saveTestScenarios,
  getUserTestResults,
  updateCompanyName,
  getCurrentUser
};
