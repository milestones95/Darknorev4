import { useCallback, useMemo, useState } from 'react';
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


const Page = () => {
  const [testSteps, setTestSteps] = useState([{id: uuidv4(), text:""}, {id: uuidv4(), text:""}]);
  const [scenarios, setScenarios] = useState([
      {id: uuidv4(), "scenario": "User enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:""}, {id: uuidv4(), text:""}]},
      {id: uuidv4(), "scenario": "User does not enters a valid name and email address and submits the form successfully.", "testSteps":[{id: uuidv4(), text:""}, {id: uuidv4(), text:""}]},
      {id: uuidv4(), "scenario": "User does not enters a valid name and phone number and submits the form successfully.", "testSteps":[{id: uuidv4(), text:""}, {id: uuidv4(), text:""}]}
  ])

  function handleAddNewTestStep(index) {
    const updatedScenarios = [...scenarios];
    const updatedTestSteps = updatedScenarios[index].testSteps.concat({id: uuidv4(), text:""})
    updatedScenarios[index].testSteps = updatedTestSteps
    setScenarios(updatedScenarios)
  }

  function handleRemove(index, id) {
    const updatedScenarios = [...scenarios];
    const updatedTestSteps = updatedScenarios[index].testSteps.filter((item) => item.id !== id);
    updatedScenarios[index].testSteps = updatedTestSteps
    setScenarios(updatedScenarios)
  }

  return (
    <>
      <Head>
        <title>
          Customers | Devias Kit
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
                  />
                </Card>
              )
            })}
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{mt: 2}}
               href="/viewTest"
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
