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

  const [urlList, setUrlList] = useState(['']);
  const { testCreationData, updateScenarios, emptyData } = useContext(TestCreationData);

  useEffect(() => {
    const fetchWebPages = async () => {
      try {
        const urlsParsed = await fetch("http://localhost:8000/api/scrape-urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({url: testCreationData.baseURL}),
        });

        const response = await urlsParsed.json();
        console.log("hello");
        console.log(response); // Check the response data in the console

        setUrlList(response);
        console.log("url list: ", urlList);


      } catch (error) {
        console.error('Failed to fetch tests:', error);
        setUrlList([]);
      }
    };

    fetchWebPages();
  }, []);

  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const handleAlertClose = () => {
    setShowAlert(false);

  };


  console.log("test creation data scen: ", testCreationData.scenarios);

  const [scenarios, setScenarios] = useState(testCreationData.scenarios)


  console.log("test creation dat on steps page: " + JSON.stringify(testCreationData))

  function handleAddNewTestStep(index) {
    const updatedScenarios = [...scenarios];
    const updatedTestSteps = updatedScenarios[index].testSteps.concat({id: uuidv4(), text: updatedScenarios[index].content, webpage: "", html:""})
    updatedScenarios[index].testSteps = updatedTestSteps
    setScenarios(updatedScenarios)
  }

  function handleTypingInTextField(scenarioArrayIndex, testStepArrayIndex, value) {

    console.log("step value: ", value);
    const updatedScenarios = [...scenarios];
    updatedScenarios[scenarioArrayIndex].testSteps[testStepArrayIndex].text = value;
    setScenarios(updatedScenarios);
    console.log(updatedScenarios)
  }

  function handleSelectingWebPage(scenarioArrayIndex, testStepArrayIndex, value) {
    console.log("web page value: ", value);

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

const handleCompletingTestSteps = async (event) =>  {
  event.preventDefault();

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
    updateScenarios(scenarios);

    const testPayload = {
      testCase: testCreationData,
      urls: urlList
    };

    //Create all test cases
    const response = await fetch("http://localhost:5000/api/generateAutomatedTests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    // if (response.ok) {
    //   const responseData = await response.json();
    //   router.push({
    //     pathname: '/testScenarioPage',
    //     query: { response: JSON.stringify(responseData) },
    //   });
    // } else {
    //   // Handle the error case
    //   console.log('API request failed');
    // }

    emptyData()
    // router.push({
    //   pathname: '/',
    // });
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
                    urlList={urlList}
                  />
                </Card>
              )
            })}
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{mt: 2}}
              onClick={handleCompletingTestSteps}
            >
              Create Automated tests
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
