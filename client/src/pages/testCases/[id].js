import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
  FormGroup,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/router";
// import createJiraTicket from "../api/v1/createJiraTicket";
import axios from "axios";
import { toast } from "react-toastify";
const supabase = require("../api/SupabaseServer");
import { getCurrentUser } from "src/services/toDoServices";
import { baseUrl } from "src/utils/instanceAxios";

// Dummy data for test cases

const TestCasesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [specs, setSpecs] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State for modal
  const [newTestModal, setNewTestModal] = useState(false);
  const [openJiraModal, setOpenJiraModal] = useState(false); // State for modal
  const [testSuiteName, setTestSuiteName] = useState("");
  const [runTestLoading, setRunTestLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [runAllTestLoading, setRunAllTestLoading] = useState(false);
  const [testSuiteFileName, setTestSuiteFileName] = useState(false);
  const [test_cases, setTestCases] = useState([]);
  const [currentTestId, setCurrentTestId] = useState([]);
  const [currentTestData, setCurrentTestData] = useState({});
  const [formData, setFormData] = useState({
    description: "",
    expectedValue: "",
  });
  const [newTestPrompt, setNewTestPrompt] = useState(null);
  const [jiraFormData, setJiraFormData] = useState({
    projectDomain: "",
    projectKey: "",
    apiKey: "",
    username: "",
  });

  const [loading, setLoading] = useState(true);

  const auth = useAuth();
  const userId = auth?.user?.id;
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleModal = (currentTestId) => {
    setOpenModal(!openModal);
    setCurrentTestId(currentTestId);
  };

  const handleNewTestCaseModal = (currentTestId, currentTestData) => {
    setNewTestModal(!newTestModal);
    setCurrentTestId(currentTestId);
    setCurrentTestData(currentTestData);
  };

  const handleJiraModal = (currentTestId, currentTestData) => {
    setOpenJiraModal(!openJiraModal);
    setCurrentTestId(currentTestId);
    setCurrentTestData(currentTestData);
  };

  const handleSaveAssertion = async () => {
    try {
      const requestBody = {
        // Add additional data to the request body
        assertion_value: formData.expectedValue,
        user_id: userId,
        test_id: currentTestId,
        testData: currentTestData,
      };
      const response = await axios.post(`${baseUrl}/add-assertion`, requestBody);
      if (response.status) {
        setOpenModal(false);
        toast.success("Assertion saved successfully");
      }

    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  const createNewTest = async () => {
    // Add your logic to save assertion here
    setNewTestModal(false); // Close the modal after saving assertion
    try {
      const { data, error } = await supabase
        .from("test_cases")
        .update({ assertion_value: formData.expectedValue })
        .eq("id", currentTestId)
        .select();
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  useEffect(() => {
    // const fetchTests = async () => {
    //   try {
    //     const { id } = router.query;
    //     const response = await getCurrentTestResult(id);
    //     console.log("Test Case Response --> ", response);
    //     setTestSuiteName(response.data?.test_suite_name);
    //     const parsed = JSON.parse(response.data.json_result);
    //     setTestSuiteFileName(parsed.suites[0].file);
    //     setSpecs(parsed.suites[0].specs);
    //   } catch (error) {
    //     console.error("Failed to fetch tests:", error);
    //   }
    // };

    const fetchTestCases = async () => {
      const { id } = router.query;
      setCurrentTestId(id);
      try {
        let { data, error } = await supabase.from("test_cases").select("*").eq('test_suite_id', id);
        setTestCases(data); // Assuming test_cases is an array
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }

      // if (error) {
      //     console.error('Error fetching test cases:', error);
      //     setLoading(false);
      //     return;
      // }

      // console.log('test_cases', test_cases);
      setLoading(false);
    };

    fetchTestCases();

    // fetchTests();
  }, []);

  const fetchCurrentUser = async () => {
    console.log("🚀 ~ userId:", userId);
    const cUser = await getCurrentUser(userId);
    console.log("🚀 ~ cUser:", cUser);
    setCurrentUser(cUser?.data);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleDeleteTestSuite = async () => {
    try {
      const { data, error } = await supabase
        .from("test-suite-result")
        .delete()
        .eq("id", currentTestId);

      const { data1, error1 } = await supabase
        .from("test_cases")
        .delete()
        .eq("test_suite_id", currentTestId);
      router.push(`/testCases`);
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "green";
      case "failed":
        return "red";
      case "pending":
        return "orange";
      default:
        return "inherit";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePromptChange = (event) => {
    const { name, value } = event.target;
    console.log('prompt value: ', value)
    setNewTestPrompt(value);
  };

  const handleJiraChange = (event) => {
    const { name, value } = event.target;
    setJiraFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createJiraTicket = async () => {
    try {
      setRunTestLoading(true);
      const jiraData = {
        projectDomain: jiraFormData.projectDomain,
        projectKey: jiraFormData.projectKey,
        username: jiraFormData.username,
        apiKey: jiraFormData.apiKey,
      };
      const requestBody = {
        // Add additional data to the request body
        projectDomain: jiraFormData.projectDomain,
        projectKey: jiraFormData.projectKey,
        username: jiraFormData.username,
        apiKey: jiraFormData.apiKey,
        testData: currentTestData,
      };
      const response = await axios.post(`${baseUrl}/create-jira-ticket`, requestBody);
      if (response.status) {
        setOpenJiraModal(false);
        toast.success("JIRA ticket added successfully");

        const { data, error } = await supabase
          .from("users")
          .update({ jira_data: jiraData })
          .eq("user_id", currentUser.user_id)
          .select();
        setRunTestLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  const createJiraTicketWithSavedData = async (testCase) => {
    try {
      setRunTestLoading(true);
      const requestBody = {
        // Add additional data to the request body
        projectDomain: currentUser.jira_data.projectDomain,
        projectKey: currentUser.jira_data.projectKey,
        username: currentUser.jira_data.username,
        apiKey: currentUser.jira_data.apiKey,
        testData: testCase,
      };
      const response = await axios.post(`${baseUrl}/create-jira-ticket`, requestBody);
      if (response.status) {
        setOpenJiraModal(false);
        toast.success("JIRA ticket added successfully");
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  const generateSimilarTestCase = async () => {
    try {
      setNewTestModal(false);
      setRunTestLoading(true);
      const requestBody = {
        // Add additional data to the request body
        test_suite_id: currentTestId,
        testData: currentTestData,
        prompt: newTestPrompt,
        username: currentUser
      };
      const response = await axios.post(`${baseUrl}/create-test`, requestBody);
      // if (response.status) {
      //   setOpenJiraModal(false);
      //   toast.success("JIRA ticket added successfully");
      // }
    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  const filteredTestCases = test_cases
    .filter((test) => {
      const resultObject = JSON.parse(test.test_case);
      const result = resultObject.tests[0].results[0];
      const titleMatch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "" || result.status === filterStatus; // Assuming there's always one test and one result
      return titleMatch && statusMatch;
    })
    .map((test) => {
      const resultObject = JSON.parse(test.test_case); // Assuming there's always one test and one result\
      const result = resultObject.tests[0].results[0];
      // const startTime = new Date(result.startTime).toLocaleString(); // Convert startTime to a formatted string
      const specID = `${test.test_suite_id}-${resultObject.id}`;
      return {
        id: test.id,
        name: test.test_name,
        status: result.status,
        startTime: result.startTime,
        details: `Timeout: ${resultObject.tests[0].timeout} ms`,
        videoUrl: `https://bcghywrjwhnnkzdozmvt.supabase.co/storage/v1/object/public/test-suite-video-bucket/${encodeURIComponent(
          specID
        )}.webm`,
      };
    });

  const runTest = async (test_id) => {
    try {
      setRunTestLoading(true);
      const requestBody = {
        // Add additional data to the request body
        user_id: userId,
        test_id: test_id,
      };
      const response = await axios.post(`${baseUrl}/run-test`, requestBody);
      const data = await response.message;
      console.log("Run Test Response --> ", data);
      if (response.status === 200) {
        toast.success(data);
        setRunTestLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  const runAllTestCases = async () => {
    try {
      console.log("Test Suite Name --> ", testSuiteFileName);
      setRunAllTestLoading(true);
      const response = await axios.post(`${baseUrl}/run-all-test`, {
        testSuiteName: testSuiteFileName,
      });
      const data = await response.data;
      console.log("Run All Test Response --> ", data);
      if (data.status) {
        toast.success(data.msg);
        setRunAllTestLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Error -> ", error);
    }
  };

  return (
    <>
      <Head>
        <title>Test Cases | Darknore</title>
      </Head>

      <Grid container spacing={2} py={4} style={{ height: "100%" }}>
        <Grid
          item
          xs={2}
          style={{
            background: "linear-gradient(to bottom right, purple, cyan)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sidebar with multiple options */}
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginTop: "10px" }}>
              <Link href="/createTests">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Create Test
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/testSuites">
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Test Cases
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/testReports">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Test Reports
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/settings">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Settings
                </Button>
              </Link>
            </li>
          </ul>
          <div style={{ flex: 1 }}></div>
        </Grid>
        <Grid item xs={10}>
          {/* Filter and Search */}
          <Stack
            px={2}
            my={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6" mb={2}>
              {testSuiteName} Suite
            </Typography>
            <Button color="error" variant="outlined" onClick={() => handleDeleteTestSuite()}>
              Delete Test Suite
            </Button>
          </Stack>
          <Box my={2} px={2}>
            <Typography variant="h6" mb={2}>
              All Test Cases
            </Typography>
            <Button
              onClick={() => {
                router.back();
              }}
              variant="outlined"
            >
              Go Back
            </Button>
          </Box>
          <Grid container spacing={2} alignItems="center" style={{ marginBottom: "20px" }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Search Test Cases"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: searchTerm,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="passed">Passed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {/* {test_cases.map((testCase, index) => (
                <Typography>{testCase.test_name}</Typography>
            ))} */}
          {filteredTestCases.map((testCase) => (
            <Accordion
              key={testCase.id}
              sx={{
                marginBottom: "10px",
                paddingLeft: "20px",
                borderLeft: `10px solid ${
                  testCase.status === "passed"
                    ? "green"
                    : testCase.status === "failed"
                    ? "red"
                    : "orange"
                }`,
                position: "relative", // Add this to make position relative for absolute positioning
              }}
            >
              <AccordionSummary style={{ justifyContent: "space-between" }}>
                <ListItemText primary={testCase.name} secondary={`Status: ${testCase.status}`} />
                {/* Button to open modal for adding assertions */}
                <Button variant="outlined" color="primary" size="small" onClick={() => handleModal(testCase.id)}>
                  Add Assertion
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    if (currentUser && currentUser.jira_data) {
                      createJiraTicketWithSavedData(testCase);
                    } else {
                      handleJiraModal(testCase.id, testCase);
                    }
                  }}
                >
                  Create Jira Ticket
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {

                      handleNewTestCaseModal(testCase.id, testCase)
                  }}
                >
                  Generate similar test
                </Button>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{testCase.startTime}</Typography>
                <iframe
                  width="560"
                  height="315"
                  src={testCase.videoUrl}
                  title={testCase.name}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                {/* Button to run the test */}
                <Button
                  variant="contained"
                  color="primary"
                  style={{ position: "absolute", bottom: 10, right: 10 }}
                  onClick={() => runTest(testCase.id)} // Assuming you have a function to run the test
                >
                  {runTestLoading ? <CircularProgress color="warning" size={24} /> : "Run Test"}
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
          {/* Modal for adding assertions */}
          <Modal open={openModal} onClose={handleModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Add Assertion
              </Typography>
              <FormGroup>
                <TextField
                  label="Description"
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <TextField
                  label="Expected Value"
                  fullWidth
                  name="expectedValue"
                  value={formData.expectedValue}
                  onChange={handleChange}
                />
              </FormGroup>
              {/* Button to save assertion */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAssertion}
                style={{ marginTop: "10px" }}
              >
                Save Assertion
              </Button>
            </Box>
          </Modal>
          <Modal open={newTestModal} onClose={handleNewTestCaseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Create Similar test case
              </Typography>
              <FormGroup>
                <TextField
                  label="Prompt"
                  fullWidth
                  name="prompt"
                  value={newTestPrompt}
                  onChange={handlePromptChange}
                />
              </FormGroup>
              {/* Button to save assertion */}
              <Button
                variant="contained"
                color="primary"
                onClick={generateSimilarTestCase}
                style={{ marginTop: "10px" }}
              >
                Create new test
              </Button>
            </Box>
          </Modal>

          <Modal open={openJiraModal} onClose={handleJiraModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                JIRA Details
              </Typography>
              <FormGroup>
                <TextField
                  label="Jira Project Domain"
                  fullWidth
                  name="projectDomain"
                  style={{ marginTop: "10px" }}
                  value={jiraFormData.projectDomain}
                  onChange={handleJiraChange}
                />
                <TextField
                  label="Jira Project Key"
                  fullWidth
                  name="projectKey"
                  style={{ marginTop: "10px" }}
                  value={jiraFormData.projectKey}
                  onChange={handleJiraChange}
                />
                <TextField
                  label="Jira Username"
                  fullWidth
                  name="username"
                  style={{ marginTop: "10px" }}
                  value={jiraFormData.username}
                  onChange={handleJiraChange}
                />
                <TextField
                  label="Jira Api Key"
                  fullWidth
                  name="apiKey"
                  style={{ marginTop: "10px" }}
                  value={jiraFormData.apiKey}
                  onChange={handleJiraChange}
                />
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={createJiraTicket}
                style={{ marginTop: "10px" }}
              >
                Create Jira Ticket
              </Button>
            </Box>
          </Modal>
          {/* Button to run all tests */}
          <Button
            onClick={() => {
              runAllTestCases();
            }}
            variant="contained"
            color="primary"
            style={{ position: "fixed", bottom: 20, right: 20 }}
          >
            {runAllTestLoading ? <CircularProgress color="warning" size={24} /> : "Run All Test"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

TestCasesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TestCasesPage;
