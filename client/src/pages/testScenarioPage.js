import {useCallback, useMemo, useState, useContext, useEffect} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {subDays, subHours} from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography
} from "@mui/material";
import {useSelection} from "src/hooks/use-selection";
import {Layout as DashboardLayout} from "src/layouts/dashboard/layout";
import {TestScenarios} from "src/sections/createTests/testScenarios";
import {SelectScenario} from "src/sections/createTests/scenario-select";
import {applyPagination} from "src/utils/apply-pagination";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import {TestCreationData} from "src/contexts/test-creation-context";
import {useAuthContext} from "../contexts/auth-context";
import {saveTestScenarios} from "../services/toDoServices";
import {deleteTestCase, getTestCases, saveTestCases} from "src/services/testCase";
import {
  createNewScenarioType,
  getScenarioType
} from "src/services/scenarioTypes";
import {addTestCategory, getTestCategories} from "src/services/testCategory";
import SnackBar from "src/components/snackBar";
import {createNewUserStory, updateUserStory} from "src/services/userStory";
import {LoadingButton} from "@mui/lab";
const now = new Date();

const data = [
  {
    scenario:
      "User enters a valid name and email address and submits the form successfully.",
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters a valid name and a valid email address with special characters and submits the form successfully.",
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters an invalid name (e.g. numbers, special characters) and a valid email address and submits the form. The form should not be submitted and an error message should be displayed.",
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters a valid name and an invalid email address (e.g. missing '@' symbol, incorrect domain) and submits the form. The form should not be submitted and an error message should be displayed.",
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  }
];

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

const Page = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [snackBar, setSnackBar] = useState(null);
  const router = useRouter();

  const response = JSON.parse(router.query.response || "{}");
  const testCaseObject = parseTestCases(response.result.content);
  
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const {user} = useAuthContext();
  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const {testCreationData, addTestCases} = useContext(TestCreationData);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [existingTestCases, setExistingTestCases] = useState([]);

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

  const scenarios = testCaseObject.Test_Case_Scenarios;

  // const stringifiedTestCaseObject =  JSON.stringify(testCaseObject);
  // console.log("test case object: " + JSON.stringify(testCaseObject));
  //
  // const breakupJson = response.result.content.split("\n");
  // const removeSpaces = breakupJson.filter((item) => item !== '');
  // const removeTestScenarioTest = removeSpaces.filter((item) => item !== 'Test Case Scenarios:');
  // var scenarios = removeTestScenarioTest;

  // console.log("scenarios: " + scenarios);

  function parseTestCases(string) {
    const jsonObject = JSON.parse(string);
    return jsonObject;
  }

  const useScenarios = (page, rowsPerPage) => {
    return useMemo(
      () => {
        return applyPagination(
          scenarios.map(testCase => {
            console.log("fixing checkboxes: ", testCase.test_case);
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
    if (window.location.search.includes("userStoryName") === false) {
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
            name: testCreationData.userStoryName,
            user_story_details: testCreationData.userStoryDescription,
            acceptance_criteria: testCreationData.acceptanceCriteria,
            project_id: getProjectId(),
          });
          setSnackBar({ message: "SuccessFully Saved User Story!", severity: "success"});
          userStoryId = response.data.id;
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
      // Find the corresponding scenario object using the selection value
      const selectedScenario = scenarios.find(
        scenario => scenario.test_case === selection
      );

      // console.log("selectedScenario", selectedScenario);
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
        scenario_type_id = response.data.id;
      }
      // Extract the id and scenario_type properties
      // const { id, scenario_type } = selectedScenario;

      return {
        test_case: selection,
        test_category_id: scenario_type_id,
        user_story_id: userStoryId
      };
    });

    const selectedItems = await Promise.all(promises);
    if (selectedItems.length === 0) {
      setShowAlert(true);
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
          console.log("response was ok");
        } else {
          // Handle the error case
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

  console.log("scnenario list: " + scenarioList);
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
    console.log("back pressed")
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
            />
            <Box style = {{display: 'flex', marginLeft: 15, alignItems: 'center', fontWeight: '900'}}>
              <Typography fontWeight = '500'>Didn't Like The Test Cases?</Typography>
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
