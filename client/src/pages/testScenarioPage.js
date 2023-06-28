import { useCallback, useMemo, useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TestScenarios } from 'src/sections/createTests/testScenarios';
import { SelectScenario } from 'src/sections/createTests/scenario-select';
import { applyPagination } from 'src/utils/apply-pagination';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { TestCreationData } from 'src/contexts/test-creation-context';

const now = new Date();

const data = [
  {
    scenario: 'User enters a valid name and email address and submits the form successfully.',
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage:""}]
  },
  {
    scenario: 'User enters a valid name and a valid email address with special characters and submits the form successfully.',
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage:""}]
  },
  {
    scenario: 'User enters an invalid name (e.g. numbers, special characters) and a valid email address and submits the form. The form should not be submitted and an error message should be displayed.',
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage:""}]
  },
  {
    scenario: 'User enters a valid name and an invalid email address (e.g. missing \'@\' symbol, incorrect domain) and submits the form. The form should not be submitted and an error message should be displayed.',
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage:""}]
  },
];



const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.testScenario);
    },
    [customers]
  );
};

const Page = () => {
  const [showAlert, setShowAlert] = useState(false);
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const { testCreationData, updateScenarios } = useContext(TestCreationData);

  console.log(testCreationData)
  const router = useRouter();

  console.log(router.query.response)
  const response = JSON.parse(router.query.response || '{}');
  console.log(response)



  const testCaseObject = parseTestCases(response.result.content);
  const stringifiedTestCaseObject =  JSON.stringify(testCaseObject);
  console.log("test case object: " + JSON.stringify(testCaseObject));

  const breakupJson = response.result.content.split("\n");
  const removeSpaces = breakupJson.filter((item) => item !== '');
  const removeTestScenarioTest = removeSpaces.filter((item) => item !== 'Test Case Scenarios:');
  var scenarios = removeTestScenarioTest;

  console.log("scenarios: " + scenarios);

  function parseTestCases(string) {
    const testCaseRegex = /'scenario_type': '(.+?)', 'test_case': '(.+?)'/g;
    const testCases = [];
    let match;

    while ((match = testCaseRegex.exec(string)) !== null) {
      const scenarioType = match[1];
      const testCase = match[2];
      testCases.push({ scenario_type: scenarioType, test_case: testCase });
    }

    return testCases;
  }

  const useScenarios = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(testCaseObject.map((testCase) => testCase.test_case), page, rowsPerPage);
    }, [page, rowsPerPage]);
  };


  const handleSaveTests = async (event) => {
    event.preventDefault();
    updateScenarios(data)

    const selectedItems = customersSelection.selected.map((selection) => {
      return { content: selection };
    });

    console.log('i am selected items: ', selectedItems);
    console.log((selectedItems.length === 0) ? true : false);
    if (selectedItems.length === 0) {
      setShowAlert(true)
      return
    }
      console.log("About to call the api!!!")
      // Send the API request
      const response = await fetch("http://localhost:5000/api/saveTestScenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItems),
      });
      console.log("YOU CALLED ME!!!!!!!")

      if (response.ok) {
        router.push('/');
        console.log("response was ok")
      } else {
        // Handle the error case
        console.log('API request failed');
      }

  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const scenarioList = useScenarios(page, rowsPerPage);

  console.log("scnenario list: " + scenarioList);
  const customersSelection = useSelection(scenarioList);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Test Scenarios | Darknore
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Tests Scenario
                </Typography>
              </Stack>
              {showAlert && (
               <Alert severity="error" onClose={handleAlertClose}>
                 Please select one of the scenarios below
               </Alert>
             )}
            </Stack>
            <SelectScenario
              setDisplayedScenarios={setDisplayedScenarios}
            />
            <TestScenarios
              count={data.length}
              items={testCaseObject}
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
            />
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{ mt: 2}} onClick={handleSaveTests}
            >
              Save Tests
            </Button>
          </div>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
