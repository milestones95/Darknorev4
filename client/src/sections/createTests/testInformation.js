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
  Unstable_Grid2 as Grid,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {TestCreationData} from "src/contexts/test-creation-context";
import {createNewUserStory, getAllUserStories, getAllUserStoriesByProjectId} from "src/services/userStory";
import {UpdateUserStoryAndTestCases} from "../updateUserStoryAndTestCases/updateUserStoryAndTestCases";
import {SelectProjectAndUserStory} from "../selectProjectAndUserStory/selectProjectAndUserStory";
import {generateTestCases} from "src/services/testCase";
import {createTestScenarios} from "src/services/toDoServices";
import SnackBar from "src/components/snackBar";
import { useAuth } from "src/hooks/use-auth";
import {TestSteps} from "./testSteps";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import LabelIcon from "@mui/icons-material/LabelImportant"
import {DataContext} from "src/contexts/data-context";
import {makeStyles} from "@mui/styles";

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
  const dataContext = useContext(DataContext);
  const {testCreationData, addUserStory} = useContext(TestCreationData);
  const [showAlert, setShowAlert] = useState(false);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [isAddingTestCases, setIsAddingTestCases] = useState(false);
  const [selectedUserStory, setSelectedUserStory] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [snackBar, setSnackBar] = useState(null);
  const [selectedUserStoryName, setSelectedUserStoryName] = useState("");
  const [selectedUserStoryDetails, setSelectedUserStoryDetails] = useState("");
  const [selectedAcceptanceCriteria, setSelectedAcceptanceCriteria] = useState(
    ""
  );
  const [selectedTestSteps, setSelectedTestSteps] = useState({});
  const [isNewUserStoryName, setIsNewUserStoryName] = useState(false);
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

  const handleAddTestSteps = () => {
    setIsAddingTestCases(true);
  }

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
      name.trim() === "" ||
      userStoryDetails.trim() === "" ||
      ac.trim() === "" || Object.keys(selectedTestSteps).length === 0
    ) {
      setShowAlert(true);
      setIsGeneratingScenarios(false);
      return;
    }
    addUserStory(getProjectName(), name, userStoryDetails, ac);
    dataContext.setUserStoryDetails({
      name: name,
      storyDetails: userStoryDetails,
      acceptanceCriteria: ac
    });
    dataContext.setTestSteps(selectedTestSteps);

    // Create the request body
    const test_steps = Object.keys(selectedTestSteps).map((key) => selectedTestSteps[key]);
    const requestBody = {
      user_story_details: userStoryDetails,
      acceptance_criteria: ac,
      test_steps
    };

    // Send the API request
    let queryParams = {};
    if (window.location.search === "") {
      queryParams = {
        userStoryName: name,
        ...requestBody
      };
    } else {
      const projectId = getProjectId();
      queryParams = {
        projectId: projectId,
        projectName: getProjectName(),
        ...requestBody
      };
      try {
        const { data } = await getAllUserStoriesByProjectId(projectId);
        if (data) {
          const object = data.find((item) => item.name === name);
          if(object) {
            setSnackBar({ message: "User Story Name Alraedy Exist! Please Create different One!", severity: "error" })
            setIsGeneratingScenarios(false);
            return ;
          }
        }
      } catch (err) {
        console.log("🚀 ~ file: testInformation.js:132 ~ handleSubmit ~ err:", err);
        setSnackBar({ message: "An Error Occured!", severity: "error" })
        setIsGeneratingScenarios(false);
        return ;
      }
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
      setSnackBar({ message: "Error While Generating The Test Cases!", severity: "error" })
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

  const getAllTestSteps = async (test_steps) => {
    let obj = {};
    for (let i = 0; i < test_steps.length; i++) {
      obj[i] = test_steps[i];
    }
    setSelectedTestSteps({...obj});
  }

  const useStyles = makeStyles((theme) => ({
    placeholder: {
      '&::placeholder': {
        color: 'grey', // Your desired placeholder text color
      },
    },
  }));
  const classes = useStyles();

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
                            setIsNewUserStoryName(event.target.value.length>0)
                          }}
                          defaultValue={
                            (selectedUserStory && selectedUserStory.name) ||
                            (testCreationData && testCreationData.userStoryName)
                          }
                          // value={selectedUserStoryName}
                          InputLabelProps={{shrink: true}}
                        />
                      </Grid>
                    : null}
                  {window.location.search === ""
                    ? <Grid xs={5.7} style={{marginTop: "-2px"}}>
                        <TextField
                          label="Select Existing User Story"
                          onChange={async event => {
                            if(!isNewUserStoryName) {
                              setSelectedUserStoryDetails(
                                event.target.value.user_story_details
                              );
                              setSelectedAcceptanceCriteria(
                                event.target.value.acceptance_criteria
                              );
                              getAllTestSteps(event.target.value.test_steps);
                            }
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
                        className={classes.placeholder}
                        placeholder="As a Netflix user, I can pause my show and can return to where I left off on the show when I turn on netflix again."
                        InputProps={{
                          classes: { input: classes.placeholder}
                        }}
                      />
                    </Grid>
                    <Grid xs={12} sx={{margin: "10px"}}>
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
                        InputProps={{
                          classes: { input: classes.placeholder}
                        }}
                        placeholder={`Verify that when a user clicks pause, netflix will save the scene where they stopped watching the show.
If there is a network error when they try to pause, netflix will use the last saved index of my show and will continue from that point when they return to watch netflix.
When they press play, netflix will resume the show from the same place where they paused it.`}
                      />
                    </Grid>
                  </Grid>
                  <List
                    subheader={
                      <ListSubheader style={{color: "#6C737F", fontSize: "12px"}}>
                        Test Steps*
                      </ListSubheader>
                    }
                    style={{border: "1px solid #E5E7EB", margin: 10, borderRadius: "8px", width: "100%", paddingBottom: "20px"}}
                    disablePadding={true}
                  >
                    {Object.values(selectedTestSteps).map((value, index) => {
                      return <ListItem key={index} style={{marginBottom: "-10px", marginTop: "-10px"}}>
                        <ListItemIcon>
                          <LabelIcon fontSize="10px"/>
                        </ListItemIcon>
                        <ListItemText
                          primary={value}
                          style={{marginLeft: "-30px"}}
                        >
                        </ListItemText>
                      </ListItem>
                    })}
                    <ListItem style={{width: "250px", marginLeft: "-15px"}}>
                      <ListItemButton
                        onClick={() => {handleAddTestSteps()}}
                      >
                        <ListItemIcon>
                          <AddIcon style={{color: "#6366F1"}}/>
                        </ListItemIcon>
                        <ListItemText primary={Object.values(selectedTestSteps).length > 0 ? "Update Test Steps" : "Add Test Steps"} style={{marginLeft: "-25px", color: "#6366F1"}} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Grid>
              </Box>
            </CardContent>
            <Divider style={{margin: "10px"}}/>
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
        {isAddingTestCases ? <TestSteps
          isAddingTestCases={isAddingTestCases}
          setIsAddingTestCases={setIsAddingTestCases}
          testStepsObj={selectedTestSteps}
          setSelectedTestSteps={setSelectedTestSteps}
          isForUpdating={Object.values(selectedTestSteps).length > 0}
        /> : null}
    </form>
  );
};
