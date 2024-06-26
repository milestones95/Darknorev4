import { useCallback, useMemo, useState, useRef, useEffect, useContext} from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Alert, Box, Button, Card, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TestSteps } from 'src/sections/createTests/testSteps';
import { TestsSearch } from 'src/sections/viewTests/tests-search';
import { applyPagination } from 'src/utils/apply-pagination';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidv4 } from 'uuid';
import { TestCreationData } from 'src/contexts/test-creation-context';
import { useRouter } from 'next/navigation';


const Page = () => {

  const menuItems = [
    { key: "testpage1", value: "testpage1", label: "testpage1.com" },
    { key: "testpage2", value: "testpage2", label: "testpage2.com" },
  ];
  const [scenarios, setScenarios] = useState([
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]},
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User does not enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]},
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User does not enters a valid name and phone number and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]}
  ])

  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const handleAlertClose = () => {
    setShowAlert(false);

  };


  const { testCreationData, addTestCases, emptyData } = useContext(TestCreationData);
  console.log(testCreationData)

  function handleAddNewTestStep(index) {
    const updatedScenarios = [...scenarios];
    const updatedTestSteps = updatedScenarios[index].testSteps.concat({id: uuidv4(), text:"", webpage: ""})
    updatedScenarios[index].testSteps = updatedTestSteps
    setScenarios(updatedScenarios)
  }

  function handleTypingInTextField(scenarioArrayIndex, testStepArrayIndex, value) {
    const updatedScenarios = [...scenarios];
    updatedScenarios[scenarioArrayIndex].testSteps[testStepArrayIndex].text = value;
    setScenarios(updatedScenarios);
    console.log(updatedScenarios)
  }

  function handleSelectingWebPage(scenarioArrayIndex, testStepArrayIndex, value) {
    const updatedScenarios = [...scenarios];
    updatedScenarios[scenarioArrayIndex].testSteps[testStepArrayIndex].webpage = value;
    setScenarios(updatedScenarios);
  }

  function handleRemove(scenarioArrayIndex, id) {
    setScenarios((prevScenarios) => {
      const updatedScenarios = [...prevScenarios];
      const scenarioToUpdate = updatedScenarios[scenarioArrayIndex];

      if (scenarioToUpdate) {
        const updatedTestSteps = scenarioToUpdate.testSteps.filter(
          (testStep) => testStep.id !== id
        );
        scenarioToUpdate.testSteps = updatedTestSteps;
      }
      return updatedScenarios;
    });
  }

function handleCompletingTestSteps() {
  for (let i = 0; i < scenarios.length; i++) {
    console.log(scenarios[i].testSteps);
    for (let j = 0; j < scenarios[i].testSteps.length; j++) {
      console.log(scenarios[i].testSteps[j].text.trim());
      if (scenarios[i].testSteps[j].text.trim() === '' &&
          scenarios[i].testSteps[j].webpage.trim() === '') {
        setShowAlert(true)
        return
      }
    }
  }
    addTestCases(scenarios);
    emptyData()
    router.push({
      pathname: '/',
    });
  }

  return (
    <>
      <Head>
        <title>
          Test Steps | Darknore
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
              {showAlert && (
                  <Alert severity="error" onClose={handleAlertClose}>
                    Please complete all of your test steps.
                  </Alert>
                )}
                <Typography variant="h4">
                  Tests Steps
                </Typography>
              </Stack>
            </Stack>
            {scenarios.map((scenario, i) => {
              return (
                <Card key={i} sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                      Scenario {i + 1} - {scenario.scenario}
                    </Typography>
                  <TestSteps
                    count={scenario.testSteps.length}
                    scenario={scenario}
                    handleRemove={handleRemove}
                    handleAddNewTestStep={handleAddNewTestStep}
                    scenarios={scenarios}
                    indexOfScenarioArray={i}
                    handleTypingInTextField={handleTypingInTextField}
                    handleSelectingWebPage={handleSelectingWebPage}
                    urlList={menuItems}
                  />
                </Card>
              )
            })}
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{mt: 2}}
              onClick={handleCompletingTestSteps}
            >
              Add Test Steps
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
