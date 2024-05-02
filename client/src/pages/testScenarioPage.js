import {useCallback, useMemo, useState, useContext, useEffect} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography
} from "@mui/material";
import {useSelection} from "src/hooks/use-selection";
import {Layout as DashboardLayout} from "src/layouts/dashboard/layout";
import {TestScenarios} from "src/sections/createTests/testScenarios";
import {SelectScenario} from "src/sections/createTests/scenario-select";
import {applyPagination} from "src/utils/apply-pagination";
import Alert from "@mui/material/Alert";
import {TestCreationData} from "src/contexts/test-creation-context";
import {deleteTestCase, getTestCases, saveTestCases} from "src/services/testCase";
import {addTestCategory, getTestCategories} from "src/services/testCategory";
import SnackBar from "src/components/snackBar";
import {createNewUserStory, updateUserStory} from "src/services/userStory";
import {LoadingButton} from "@mui/lab";
import {DataContext} from "src/contexts/data-context";

const getUserStoryId = () => {
  const searhcTerm = new URLSearchParams(window.location.search);
  return searhcTerm.get("userStoryId");
};

const getProjectId = () => {
  const searchTerms = new URLSearchParams(window.location.search);
  return searchTerms.get("projectId");
};

const getProjectName = () => {
  const searchTerms = new URLSearchParams(window.location.search);
  return searchTerms.get("projectName");
};

const getUserStoryDetails = () => {
  const searchTerms = new URLSearchParams(window.location.search);
  return searchTerms.get("userStory");
};

const getAcceptanceCriteria = () => {
  const searchTerms = new URLSearchParams(window.location.search);
  return searchTerms.get("acceptanceCriteria");
};

const Page = () => {
  const dataContext = useContext(DataContext);
  const userStory = dataContext.userStoryDetails;
  const [showAlert, setShowAlert] = useState(false);
  const [snackBar, setSnackBar] = useState(null);
  const router = useRouter();

  const response = JSON.parse(router.query.response || "{}");
  const testCaseObject = parseTestCases(response.result.content);
  
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const {testCreationData, addTestCases} = useContext(TestCreationData);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [existingTestCases, setExistingTestCases] = useState([]);
  const [manuallyUpdatedTestCases, setManuallyUpdatedTestCases] = useState([]);

  const getExistingTestCases = async () => {
    try {
      const response = await getTestCases(getUserStoryId());
      if (response.status === 200) {
        setExistingTestCases(response.data);
      }
    } catch (error) {
      console.log("Error while getting existing test cases:-", error);
    }
  }
  useEffect(() => {
    getExistingTestCases();
  }, []);

  useEffect(() => {
    let eTestCases = [];
    if (existingTestCases && existingTestCases.length > 0) {
      eTestCases = existingTestCases.map((testCase) => {
        return {
          scenario_type: testCase.test_categories.name,
          test_case: testCase.test_case,
        }
      });
      setManuallyUpdatedTestCases([...eTestCases, ...scenarios]);
    } else {
      setManuallyUpdatedTestCases([...scenarios]);
    }
  }, [existingTestCases]);


  const scenarios = testCaseObject.Test_Case_Scenarios;

  function parseTestCases(string) {
    const jsonObject = JSON.parse(string);
    return jsonObject;
  }

  const useScenarios = (page, rowsPerPage) => {
    return useMemo(
      () => {
        return applyPagination(
          scenarios.map(testCase => {
            return testCase.test_case;
          }),
          page,
          rowsPerPage
        );
      },
      [page, rowsPerPage]
    );
  };

  const handleSaveTests = async event => {
    event.preventDefault();
    setShouldShowLoader(true);
    let userStoryId = getUserStoryId();
    if (window.location.search.includes("userStoryName") === false &&
      (testCreationData.userStoryName !== "" &&
        testCreationData.userStoryDescription !== "" &&
        testCreationData.acceptanceCriteria !== ""
      )
    ) {
      if (userStoryId && userStoryId !== "") {
        const response = await updateUserStory(userStoryId, {
          name: testCreationData.userStoryName,
          user_story_details: testCreationData.userStoryDescription,
          acceptance_criteria: testCreationData.acceptanceCriteria,
          project_id: getProjectId(),
        });
        userStoryId = response.data[0].id;
      } else {
        try {
          const response = await createNewUserStory({
            name: userStory.name,
            user_story_details: userStory.storyDetails,
            acceptance_criteria: userStory.acceptanceCriteria,
            test_steps: Object.values(dataContext.testSteps), 
            project_id: getProjectId(),
          });
          setSnackBar({ message: "SuccessFully Saved User Story!", severity: "success"});
          userStoryId = response.data.id;
          if (response.data) {
            dataContext.setTestSteps({});
            dataContext.setUserStoryDetails({});
          }
        } catch (error) {
          setShouldShowLoader(false);
          console.log("Error while create new user story: " + error);
        } 
      }
    }
    const itemsToBeDeleted = testCreationData.scenarios.filter(selection => customersSelection.deselected.includes(selection.test_case));
    itemsToBeDeleted.forEach(async (item) => {
      try {
        await deleteTestCase(item.id);
      } catch (error) {
        console.log("Error while deleting test case:-", error);
      }
    });
    const oldTestCases = existingTestCases.map((testCase) => testCase.test_case);
    const newTestCases = customersSelection.selected.filter(item => !oldTestCases.includes(item));
    const promises = newTestCases.map(async selection => {
      const selectedScenario = manuallyUpdatedTestCases.find(
        scenario => scenario.test_case === selection
      );

      let scenario_type_id;
      const testCategoriesResponse = await getTestCategories(
        selectedScenario.scenario_type
      );
      if (testCategoriesResponse && testCategoriesResponse.data) {
        scenario_type_id = testCategoriesResponse.data.id;
      } else {
        const response = await addTestCategory({
          name: selectedScenario.scenario_type
        });
        scenario_type_id = response.data[0].id;
      }

      return {
        test_case: selection,
        test_category_id: scenario_type_id,
        user_story_id: userStoryId
      };
    });

    const selectedItems = await Promise.all(promises);
    if (!existingTestCases.length > 0 && selectedItems.length === 0) {
      setShowAlert(true);
      setShouldShowLoader(false);
      setSnackBar({ message: "Please select at least one tes case!", severity: "error"});
      return;
    }
    addTestCases(selectedItems);
    let queryParams = {};
    if (window.location.search.includes("userStoryName")) {
      const searchTerm = new URLSearchParams(window.location.search);
      queryParams = {
        userStoryName: searchTerm.get("userStoryName"),
      }
      router.push({
        pathname: "/createProject",
        query: queryParams
      });
    } else {
      queryParams = {
        userStoryId: userStoryId,
        projectId: getProjectId(),
        projectName: getProjectName()
      }
    }
    // Send the API request
    if (window.location.search.includes("userStoryName") === false) { 
      try {
        const response = await saveTestCases(selectedItems);
        if (response.status === 200) {
          setSnackBar({ message: "SuccessFully Saved Selected Test Cases!", severity: "success"});
          router.push({
            pathname: "/viewTests",
            query: queryParams
          });
        } else {
          setShouldShowLoader(false);
          console.log("API request failed");
        } 
      } catch (error) {
        setShouldShowLoader(false);
        console.log("Error while saving test cases:-", error);
        setSnackBar({ message: "Error while saving test cases!", severity: "error"});
      }
    }
    setShouldShowLoader(false);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const scenarioList = useScenarios(page, rowsPerPage);

  const customersSelection = useSelection(scenarioList);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  useEffect(() => {
    existingTestCases.forEach(element => {
      customersSelection.handleSelectOne(element.test_case);
    });
  }, [existingTestCases]);

  const handleRowsPerPageChange = useCallback(event => {
    setRowsPerPage(event.target.value);
  }, []);
  const handleGoBack = () => {
    router.back();
  }
  return (
    <>
      <Head>
        <title>Test Scenarios | Darknore</title>
      </Head>
      {snackBar && <SnackBar message = {snackBar.message} severity = {snackBar.severity} setSnackBar = {setSnackBar}/>}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Test Scenarios</Typography>
              </Stack>
              {showAlert &&
                <Alert severity="error" onClose={handleAlertClose}>
                  Please select at least one of the scenario below
                </Alert>}
            </Stack>
            <SelectScenario setDisplayedScenarios={setDisplayedScenarios} />
            <TestScenarios
              count={scenarios.length}
              items={scenarios}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              displayedScenarios={displayedScenarios}
              existingTestCases={existingTestCases.map((testCase) => {
                return {
                  test_case: testCase.test_case,
                  scenario_type: testCase.test_categories.name
                }
              })}
              manuallyUpdatedTestCases={manuallyUpdatedTestCases}
              setManuallyUpdatedTestCases={setManuallyUpdatedTestCases}
              userStoryDetails={getUserStoryDetails()}
              acceptanceCriteria={getAcceptanceCriteria()}
            />
            <Box style = {{display: 'flex', marginLeft: 15, alignItems: 'center', fontWeight: '900'}}>
              <Typography fontWeight = '500'>Didn&apos;t Like The Test Cases?</Typography>
              <Button onClick={handleGoBack} style={{padding: 5, color: 'gray', backgroundColor: '#dfe5f0', margin: "0px 5px"}}>Go Back</Button>
              <Typography fontWeight = '500'>And Update The User Story. </Typography>
            </Box>
          </Stack>
          <div align="center">
            <LoadingButton
              type="submit"
              loading={shouldShowLoader}
              variant="contained"
              size="small"
              align="center"
              sx={{mt: 2}}
              onClick={handleSaveTests}
            >
              Save Tests
            </LoadingButton>
          </div>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page =>
  <DashboardLayout>
    {page}
  </DashboardLayout>;

export default Page;
