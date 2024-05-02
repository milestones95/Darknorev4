const express = require("express");
const {
  getTestAutomated,
  getTestScenarios,
  createTestScenarios,
  saveTestScenarios,
  getUserTestResults,
  updateCompanyName,
  getCurrentUser
} = require("../controllers/testController");

//router object
const router = express.Router();

//routers
// GET || Test Automated
router.get("/getTestAutomatedTests", getTestAutomated);

// GET || Get Test Scenarios of the login user
router.get("/getTestScenarios", getTestScenarios);

//POST || Create Test Scenarios
router.post("/createTestScenarios", createTestScenarios);

//POST || Save Test Scenarios
router.post("/saveTestScenarios", saveTestScenarios);

router.post("/updateCompanyName", updateCompanyName);

// GET || Get Test Scenarios of the user
router.get("/getUserTestResults", getUserTestResults);

router.get("/getCurrentUser", getCurrentUser);

module.exports = router;
