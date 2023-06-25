import { useCallback, useMemo, useState, useRef, useEffect, useContext} from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TestSteps } from 'src/sections/createTests/testSteps';
import { TestsSearch } from 'src/sections/viewTests/tests-search';
import { applyPagination } from 'src/utils/apply-pagination';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { v4 as uuidv4 } from 'uuid';
import { TestCreationData } from 'src/contexts/test-creation-context';


const Page = () => {
  const [scenarios, setScenarios] = useState([
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]},
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User does not enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]},
      {scenarioType: "Happy Path", createdAt: "06/19/2023", id: uuidv4(), "scenario": "User does not enters a valid name and phone number and submits the form successfully.", "testSteps":[{id: uuidv4(), text:'', webpage:""}, {id: uuidv4(), text:'', webpage:""}]}
  ])

  const { testCreationData, updateScenarios, emptyData } = useContext(TestCreationData);
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
  }

  function handleSelectingWebPage(scenarioArrayIndex, testStepArrayIndex, value) {
    const updatedScenarios = [...scenarios];
    updatedScenarios[scenarioArrayIndex].testSteps[testStepArrayIndex].webpage = value;
    setScenarios(updatedScenarios);
  }

  function handleRemove(scenarioArrayIndex, id) {
    const updatedScenarios = [...scenarios];
    const scenarioToUpdate = updatedScenarios.find((scenario) => scenario.id === scenarios[scenarioArrayIndex].id);

    if (scenarioToUpdate) {
      const updatedTestSteps = scenarioToUpdate.testSteps.filter((testStep) => testStep.id !== id);
      scenarioToUpdate.testSteps = updatedTestSteps;
    }
    setScenarios(updatedScenarios);
  }

function handleCompletingTestSteps() {
    updateScenarios(scenarios);
    emptyData()
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
                <Typography variant="h4">
                  Tests Steps
                </Typography>
              </Stack>
            </Stack>
            {scenarios.map((scenario, i) => {
              return (
                <Card sx={{ p: 2 }}>
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
                  />
                </Card>
              )
            })}
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{mt: 2}}
               href="/" onClick={handleCompletingTestSteps}
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
