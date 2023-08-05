const { Configuration, OpenAIApi } = require("openai");
const path = require('path');


const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const completion =  openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
    {"role": "system", "content": "You are an assistant that is a quality assurance tester. Your task is to create detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test the similar things as the one given to you by a user. These test cases scenarios should tests similar things and test case scenarios should be the same type as the one given to you by the user these types are happy paths, non-happy paths, and even edge cases. Declare each test case should be prepended by its scenario type separated by a colon. "},
    {"role": "user", "content":
          `Can you make detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
              {
                "Test_Case_Scenarios":
                [
                  {
                    "scenario_type": "Non-Happy Path",
                    "test_case": "If a user fast forwards through a tv show and pauses, Netflix will save the index where the user paused successfully"
                  }
                ]
              }
          `
    },
    {"role": "assistant", "content": `
    {
        "Test_Case_Scenarios": [
          {
            "scenario_type": "Non-Happy Path",
            "test_case": "A user clicks the play button to pause a show, then the user closes the netflix app, next to user comes back in 30 minutes and reopens the app, next the user navigates back to their orginial show, then the user opens the video player from the show, and the show resumes at the point where a user paused it."
          },
          {
            "scenario_type": "Non-Happy Path",
            "test_case": "A user is watching a show on Netflix and the app suddenly closes, the user eventually navigates back to the Netflix homepage, the user finds a show they were previously watching, they reopen the video player, and their show resumes from where it left off at."
          },
        ]
      }`},
    {"role": "user", "content": `
        Can you make at least 3 detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
        {
          "Test_Case_Scenarios":
          [
            {
              "scenario_type": "Non-Happy Path",
              "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a quantity of -5lbs, clicks 'buy', the user recieves the following error message, "please enter quantity that is greater than 0"
            }
          ]
        }
      `
    },
    {"role": "assistant", "content": `
    {
        "Test_Case_Scenarios": [
          {
            "scenario_type": "Non-Happy Path",
            "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a quantity of 1000lbs, clicks 'buy', the user receives the following error message, 'please enter quantity that is less than or equal to 500lbs."
          },
          {
            "scenario_type": "Non-Happy Path",
            "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters Z, the user immeditately recieves the following error message, "please only enter numeric values in this text box."
          },
          {
            "scenario_type": "Non-Happy Path",
            "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a quantity of 5.5lbs, clicks 'buy', the user receives the following error message, 'please enter whole numbers into the quanity section."
          },
        ]
      }`},
      {"role": "user", "content": `
          Can you make at least 3 detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
          {
            "Test_Case_Scenarios":
            [
              {
                "scenario_type": "Happy Path",
                "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, clicks 'buy', selects 'credit card' as the payment method, enters valid credit card details, enters a tip above $0, and the users' order is completed."
              }
            ]
          }
        `
      },
      {"role": "assistant", "content": `
      {
          "Test_Case_Scenarios": [
            {
              "scenario_type": "Happy Path",
              "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, clicks 'buy', selects 'credit card' as the payment method, enters valid credit card details, enters a tip of $5, and the users' order is completed."
            },
            {
              "scenario_type": "Happy Path",
              "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 50lbs, clicks 'buy', selects 'credit card' as the payment method, enters valid credit card details, enters a tip of $50, and the users' order is completed."
            },
            {
              "scenario_type": "Happy Path",
              "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 499lbs, clicks 'buy', selects 'credit card' as the payment method, enters valid credit card details, enters a tip of $0, and the users' order is completed."
            },
          ]
        }`},
        {"role": "user", "content": `
            Can you make at least 3 detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
            {
              "Test_Case_Scenarios":
              [
                {
                  "scenario_type": "Edge Case",
                  "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, adds the item to their cart, clicks the back button and visits the services page, leaves the services page and sees that the detergent is still in their cart."
                }
              ]
            }
          `
        },
        {"role": "assistant", "content": `
        {
            "Test_Case_Scenarios": [
              {
                "scenario_type": "Edge Case",
                "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, adds the item to their cart, clicks the back button and visits the services page, leaves the services page and sees that the detergent is still in their cart, user then selects buy, then selects pay with credit card, tips $5, and completes their purchase"
              },
              {
                "scenario_type": "Edge Case",
                "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, adds the item to their cart, clicks the back button and visits the services page, the user completes a purchase on the service page. After that the user revisits the products page and sees that the detergent is still in their cart, user then selects buy, then selects pay with credit card, tips $5, and completes their purchase"
              },
              {
                "scenario_type": "Edge Case",
                "test_case": "User successfully logs in, selects 'products' from the dropdown menu, selects 'detergent' from the product page, enters a valid quantity of 5lbs, adds the item to their cart, clicks the back button and visits the services page, the user completes a purchase on the service page. Waits an hour and then the user revisits the products page and sees that the detergent is still in their cart, user then selects buy, then selects pay with credit card, tips $5, and completes their purchase"
              },
            ]
          }`},
          {"role": "user", "content": `
              Can you make at least 5 detailed (includes numbers, timeframe, exact user actions, etc.) test case scenarios that test similar functionalities as the test case scenario below?
              {
                "Test_Case_Scenarios":
                [
                  {
                    "scenario_type": "Edge Case",
                    "test_case": "When a user enters a very long name (e.g. 100 characters) and a valid email address, the form submission will succeed."
                  }
                ]
              }
            `
          },
    ],
    temperature: 0.2,
}).then((value) => {
  console.log(value.data.choices);
  // Expected output: "Success!"
});
