import Head from 'next/head';
import { Box, Container, Stack, Unstable_Grid2 as Grid, Divider } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { UpdateUserStoryAndTestCases } from 'src/sections/updateUserStoryAndTestCases/updateUserStoryAndTestCases';
import {LoadingButton} from "@mui/lab";
import {useEffect, useState, useContext} from 'react';
import {getUserStoryById} from 'src/services/userStory';
import {useRouter} from 'next/router';
import {generateMoreTestCases, getTestCases} from 'src/services/testCase';
import {TestCreationData} from 'src/contexts/test-creation-context';

const Page = () => {
  const router = useRouter();
  const {addUserStory} = useContext(TestCreationData)
  const [userStory, setUserStory] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [testStepsObj, setTestStepsObj] = useState({});
  
  const getUserStoryId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("userStoryId");
  }
  const getProjectId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectId");
  }
  const getProjectName = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectName");
  }
  const getUserStoryDetails = async () => {
    try {
      const userStoryId = getUserStoryId();
      const response = await getUserStoryById(userStoryId);
      const userStory = response.data;
      if (userStory) {
        let obj = {};
        for (let i = 0; i < userStory.test_steps.length; i++) {
          obj[i] = userStory.test_steps[i];
        }
        setTestStepsObj({...obj});
      }
      setUserStory(response.data);
    } catch (error) {
      console.log("Error while getting user story details:", error);
    }
  }

  const getAllTestCases = async () => {
    try {
      const userStoryId = getUserStoryId();
      const response = await getTestCases(userStoryId);
      if (response.status === 200) {
        setTestCases(response.data); 
      }
    } catch (error) {
      console.log("Error while getting all test cases:", error);
    }
  }

  const handleSubmit = async (name, userStoryDetails, ac) => {
    setShowLoading(true);
    addUserStory(getProjectName(), name, userStoryDetails, ac, testCases);
    try {
      let existingTestCases = [];
      for (let i = 0; i < testCases.length; i++) {
        const obj = {
          test_case: testCases[i].test_case,
          scenario_type: testCases[i].test_categories.name
        }
        existingTestCases.push(obj);
      }
      const response = await generateMoreTestCases({
        user_story_details: userStoryDetails,
        acceptance_criteria: ac,
        existing_test_cases: existingTestCases,
        test_steps: []
      });
      if (response.ok) {
        const responseData = await response.json();
        const queryParams = {
          userStoryId: getUserStoryId(),
          projectId: getProjectId(),
          projectName: getProjectName(),
          response: JSON.stringify(responseData)
        }
        router.push({
          pathname: "/testScenarioPage",
          query: queryParams
        })
      } 
    } catch (error) {
      console.log("Error while creating new test scenarios:-", error);
      setShowLoading(false);
    }
    setShowLoading(false);
  }

  useEffect(() => {
    getUserStoryDetails();
    getAllTestCases();
  }, []);
  return (
    <>
      <Head>
        <title>
          View Tests | Darknore
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                >
                  {userStory && <UpdateUserStoryAndTestCases
                    testCases={testCases}
                    setTestCases = {setTestCases}
                    userStory={userStory}
                    testStepsObj={testStepsObj}
                  ></UpdateUserStoryAndTestCases>}
                </Grid>
              </Grid>
            </div>
          </Stack>
          <Divider style={{margin: 40}}/>
          <Grid container sx={{display: "flex", justifyContent: "center"}}>
          {userStory && <LoadingButton
            variant="contained"
            type="submit"
            loading={showLoading}
            onClick={async () => {
              await handleSubmit(userStory.name, userStory.user_story_details, userStory.acceptance_criteria);
            }}
          >
            Generate More Scenarios
          </LoadingButton>}
          </Grid>
        </Container>
      </Box>
    </>
  )
};


Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
