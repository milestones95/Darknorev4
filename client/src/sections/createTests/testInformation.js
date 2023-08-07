import {useCallback, useState, useContext, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {TestCreationData} from "src/contexts/test-creation-context";
import {createNewUserStory, getAllUserStories} from "src/services/userStory";
import {UpdateUserStoryAndTestCases} from "../updateUserStoryAndTestCases/updateUserStoryAndTestCases";
import {SelectProjectAndUserStory} from "../selectProjectAndUserStory/selectProjectAndUserStory";
import {generateTestCases} from "src/services/testCase";
import {createTestScenarios} from "src/services/toDoServices";
import SnackBar from "src/components/snackBar";
import { useAuth } from "src/hooks/use-auth";

const states = [
  {
    value: "alabama",
    label: "Alabama"
  },
  {
    value: "new-york",
    label: "New York"
  },
  {
    value: "san-francisco",
    label: "San Francisco"
  },
  {
    value: "los-angeles",
    label: "Los Angeles"
  }
];

export const TestInformation = props => {
  const {testCreationData, addUserStory} = useContext(TestCreationData);
  const [showAlert, setShowAlert] = useState(false);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [selectedUserStory, setSelectedUserStory] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [snackBar, setSnackBar] = useState(null);
  const [selectedUserStoryName, setSelectedUserStoryName] = useState("");
  const [selectedUserStoryDetails, setSelectedUserStoryDetails] = useState("");
  const [selectedAcceptanceCriteria, setSelectedAcceptanceCriteria] = useState(
    ""
  );
  const auth = useAuth();
  const router = useRouter();

  const getProjectId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectId");
  };

  const getProjectName = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectName");
  };

  const getAllCurrentUserStories = async () => {
    try {
      const response = await getAllUserStories(auth.user.id);
      setUserStories(response.data);
    } catch (error) {
      console.log("Error while getting current users stories", error);
    }
  };

  useEffect(() => {
    if (testCreationData) {
      setSelectedUserStoryName(testCreationData.userStoryName);
      setSelectedUserStoryDetails(testCreationData.userStoryDescription);
      setSelectedAcceptanceCriteria(testCreationData.acceptanceCriteria);
    }
    getAllCurrentUserStories();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setIsGeneratingScenarios(true);

    console.log("generate clicked", selectedUserStory);

    // Get the form field values
    const name = selectedUserStoryName;
    const userStoryDetails = selectedUserStoryDetails;
    const ac = selectedAcceptanceCriteria;

    if (
      name.trim() === "" &&
      userStoryDetails.trim() === "" &&
      ac.trim() === ""
    ) {
      setShowAlert(true);
      setIsGeneratingScenarios(false);
      return;
    }

    addUserStory(getProjectName(), name, userStoryDetails, ac);

    // Create the request body
    const requestBody = {
      userStory: userStoryDetails,
      acceptanceCriteria: ac
    };

    // Send the API request
    let queryParams = {};
    if (window.location.search === "") {
      queryParams = {
        userStoryName: name
      };
    } else {
      queryParams = {
        projectId: getProjectId(),
        projectName: getProjectName()
      };
    }
    const response = await generateTestCases(requestBody);
    if (response.ok) {
      setSnackBar({ message: "SuccessFully Generated The Test Cases!", severity: "success" })
      const responseData = await response.json();
      queryParams["response"] = JSON.stringify(responseData);
      router.push({
        pathname: "/testScenarioPage",
        query: queryParams
      });
    } else {
      // Handle the error case
      console.log("API request failed");
    }
    setIsGeneratingScenarios(false);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const getUserStoryId = () => {
    const searchTerm = new URLSearchParams(window.location.search);
    return searchTerm.get("userStoryId");
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      {snackBar && <SnackBar message = {snackBar.message} severity = {snackBar.severity} setSnackBar = {setSnackBar}/>}
      {!getUserStoryId()
        ? <Card>
            <CardHeader
              subheader={`The information below will be used to generate your plain english test scenarios. ${selectedUserStoryName ===
                "" &&
                selectedUserStory &&
                selectedUserStory.name}`}
              title="Test Information"
              style={{marginBottom: "10px"}}
            />
            <CardContent sx={{pt: 0}}>
              {showAlert &&
                <Alert severity="error" onClose={handleAlertClose}>
                  Please fill in all of the text fields.
                </Alert>}
              <Box sx={{m: -1.5}}>
                <Grid container>
                  {window.location.search === ""
                    ? <Grid
                        xs={5.5}
                        style={{
                          marginRight: "50px",
                          marginLeft: "10px",
                          marginBottom: "10px"
                        }}
                      >
                        <TextField
                          fullWidth
                          fullHeight
                          label={"User Story Name"}
                          name="userStoryName"
                          required
                          onChange={async event => {
                            setSelectedUserStoryName(event.target.value);
                          }}
                          defaultValue={
                            (selectedUserStory && selectedUserStory.name) ||
                            (testCreationData && testCreationData.userStoryName)
                          }
                          value={selectedUserStoryName}
                          InputLabelProps={{shrink: true}}
                        />
                      </Grid>
                    : null}
                  {window.location.search === ""
                    ? <Grid xs={5.7} style={{marginTop: "-2px"}}>
                        <TextField
                          label="Select Existing User Story"
                          onChange={async event => {
                            setSelectedUserStoryName(event.target.value.name);
                            setSelectedUserStoryDetails(
                              event.target.value.user_story_details
                            );
                            setSelectedAcceptanceCriteria(
                              event.target.value.acceptance_criteria
                            );
                            setSelectedUserStory(event.target.value);
                          }}
                          select
                          fullWidth
                        >
                          {userStories &&
                            userStories.map(userStory => {
                              return (
                                <MenuItem key={userStory} value={userStory}>
                                  {userStory.name}
                                </MenuItem>
                              );
                            })}
                        </TextField>
                      </Grid>
                    : null}
                  <Grid xs={12}>
                    {window.location.search !== ""
                      ? <Grid
                          xs={12}
                          sx={{margin: "10px", marginBottom: "20px"}}
                        >
                          <TextField
                            fullWidth
                            fullHeight
                            label={"User Story Name"}
                            name="userStoryName"
                            required
                            defaultValue={
                              (selectedUserStory && selectedUserStory.name) ||
                              (testCreationData &&
                                testCreationData.userStoryName)
                            }
                            InputLabelProps={{shrink: true}}
                            onChange={event => {
                              setSelectedUserStoryName(event.target.value);
                            }}
                          />
                        </Grid>
                      : null}
                    <Grid xs={12} sx={{margin: "10px", marginBottom: "20px"}}>
                      <TextField
                        fullWidth
                        fullHeight
                        label={"User Story Description"}
                        name="userStoryDescription"
                        multiline
                        rows={4}
                        required
                        defaultValue={
                          (selectedUserStory &&
                            selectedUserStory.user_story_details) ||
                          (testCreationData &&
                            testCreationData.userStoryDescription)
                        }
                        value={selectedUserStoryDetails}
                        InputLabelProps={{shrink: true}}
                        onChange={event => {
                          setSelectedUserStoryDetails(event.target.value);
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sx={{margin: "10px", marginBottom: "20px"}}>
                      <TextField
                        fullWidth
                        fullHeight
                        label={"Acceptance Criteria"}
                        name="acceptanceCriteria"
                        multiline
                        rows={4}
                        required
                        defaultValue={
                          (selectedUserStory &&
                            selectedUserStory.acceptance_criteria) ||
                          (testCreationData &&
                            testCreationData.acceptanceCriteria)
                        }
                        value={selectedAcceptanceCriteria}
                        InputLabelProps={{shrink: true}}
                        onChange={event => {
                          setSelectedAcceptanceCriteria(event.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{justifyContent: "center", marginBottom: "20px"}}>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isGeneratingScenarios}
              >
                Generate Scenarios
              </LoadingButton>
            </CardActions>
          </Card>
        : <UpdateUserStoryAndTestCases />}
    </form>
  );
};
