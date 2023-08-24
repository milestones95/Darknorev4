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
  SvgIcon,
  Unstable_Grid2 as Grid
} from "@mui/material";
import {useEffect, useState, useContext} from "react";
import {Layout as DashboardLayout} from "src/layouts/dashboard/layout";
import {createNewProject, getAllProjects} from "src/services/project";
import {LoadingButton} from "@mui/lab";
import CrossIcon from "@heroicons/react/24/solid/XMarkIcon";
import {TestCreationData} from "src/contexts/test-creation-context";
import {
  createNewUserStory,
  getAllUserStoriesByProjectId
} from "src/services/userStory";
import {saveTestCases} from "src/services/testCase";
import {useRouter} from "next/router";
import {useAuth} from "src/hooks/use-auth";
import {DataContext} from "src/contexts/data-context";

const Page = props => {
  const dataContext = useContext(DataContext);
  const {testCreationData} = useContext(TestCreationData);
  const [projects, selectProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [shouldShowTextField, setShouldShowTextField] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [userStoryName, setUserStoryName] = useState(
    testCreationData.userStoryName
  );
  const [
    shouldShowUserStoryTextField,
    setShouldShowUserStoryTextField
  ] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const userId = auth.user.id;
  const getAllExistingProjects = async () => {
    try {
      const response = await getAllProjects(userId);
      if (response.status === 200) {
        selectProjects(response.data);
      }
    } catch (error) {
      console.log("Error while getting all projects:-", error);
    }
  };

  useEffect(() => {
    getAllExistingProjects();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setShowLoading(true);

    if (event.target.elements.project.value === "") {
      setShowAlert("Please Select The Option!");
      setShowLoading(false);
      return;
    }
    let projectId, projectName;
    try {
      if (typeof selectedProject === "string") {
        const savedProjectResponse = await createNewProject({
          name: selectedProject,
          user_id: userId
        });
        if (savedProjectResponse && savedProjectResponse.status === 200) {
          projectId = savedProjectResponse.data.id;
          projectName = savedProjectResponse.data.name;
        }
      } else {
        projectId = selectedProject.id;
        projectName = selectedProject.name;
      }
      try {
        const {data} = await getAllUserStoriesByProjectId(projectId);
        if (data) {
          const object = data.find(item => item.name === userStoryName);
          if (object) {
            setShowAlert(
              "This User Story Name Alerady Exist In This Project! Please Use Different Name."
            );
            setShouldShowUserStoryTextField(true);
            setIsGeneratingScenarios(false);
            return;
          }
        }
        const savedUserStoryResponse = await createNewUserStory({
          name: userStoryName,
          user_story_details: testCreationData.userStoryDescription,
          acceptance_criteria: testCreationData.acceptanceCriteria,
          test_steps: Object.values(dataContext.testSteps),
          project_id: projectId
        });
        if (savedUserStoryResponse && savedUserStoryResponse.data) {
          const testCases = [...testCreationData.scenarios];
          const userStoryId = savedUserStoryResponse.data.id;
          testCases.forEach(testCase => {
            return (testCase["user_story_id"] = userStoryId);
          });
          try {
            const saveTestCasesResponse = await saveTestCases(testCases);
            if (saveTestCasesResponse && saveTestCasesResponse.status === 200) {
              router.push({
                pathname: "/viewTests",
                query: {
                  userStoryId: userStoryId,
                  projectId: projectId,
                  projectName: projectName
                }
              });
              if (response.data) {
                dataContext.setTestSteps({});
                dataContext.setUserStoryDetails({});
              }
            }
          } catch (error) {
            console.log("Error while saving test cases:-", error);
          }
        }
      } catch (error) {
        console.log("Error while saving user story:-", error);
      }
    } catch (error) {
      console.log("Error while saving project:-", error);
    }
    setShowLoading(false);
  };

  const handleAlertClose = () => {
    setShowAlert(null);
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card style={{margin: 50}}>
        <CardHeader
          subheader="Create a new project or select from the existing projects"
          title="Project"
          style={{marginBottom: "10px"}}
        />
        <CardContent sx={{pt: 0}}>
          {showAlert &&
            <Alert severity="error" onClose={handleAlertClose}>
              {showAlert}
            </Alert>}
          {shouldShowUserStoryTextField &&
            <TextField
              style={{width: 500, margin: 4}}
              label={"User Story Name"}
              onChange={event => {
                setUserStoryName(event.target.value);
              }}
              name="User Story Name"
              value={userStoryName}
            />}
          <Box sx={{m: -1.5}}>
            <Grid
              container
              sx={{margin: 2, display: "flex", alignItems: "center"}}
            >
              <TextField
                select={!shouldShowTextField}
                style={{width: 500}}
                label={
                  shouldShowTextField
                    ? "Enter New Project Name"
                    : "Select Existing Project"
                }
                onChange={event => {
                  if (event.target.value === "createNewProject") {
                    setShouldShowTextField(true);
                  }
                  setSelectedProject(event.target.value);
                  setShouldShowUserStoryTextField(false);
                  setShowAlert(null);
                }}
                name="project"
              >
                {projects &&
                  projects.map(project => {
                    return (
                      <MenuItem key={project} value={project}>
                        {project.name}
                      </MenuItem>
                    );
                  })}
                <MenuItem key={"createNewProject"} value={"createNewProject"}>
                  Create New Project
                </MenuItem>
              </TextField>
              {shouldShowTextField
                ? <Button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onClick={() => {
                      setShouldShowTextField(false);
                    }}
                  >
                    <SvgIcon fontSize="medium" style={{color: "#000"}}>
                      <CrossIcon />
                    </SvgIcon>
                  </Button>
                : null}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions
          sx={{
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "10px"
          }}
        >
          <LoadingButton
            variant="contained"
            type="submit"
            loading={showLoading}
          >
            Save Test Cases
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
};

Page.getLayout = page =>
  <DashboardLayout>
    {page}
  </DashboardLayout>;

export default Page;
