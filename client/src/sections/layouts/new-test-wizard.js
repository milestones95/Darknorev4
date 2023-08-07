import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState, useEffect } from 'react';

const steps = [
  '',
  '',
  '',
];

export default function NewTestWizard() {
  const [currentSteps, setCurrentSteps] = useState((0));
  useEffect(() => {
    if (window.location.pathname.startsWith('/createTests'))
      if (window.location.search === "") {
        setCurrentSteps((0))
      } else {
        setCurrentSteps((1))
      }
    if (window.location.pathname.startsWith('/testScenarioPage'))
      if (window.location.search.includes("userStoryName")) {
        setCurrentSteps((0,1))
      } else {
        setCurrentSteps((1,2))
      }
    if (window.location.pathname.startsWith('/createProject'))
        setCurrentSteps((1,2))
  }, [window.location.pathname]);


  return (
    <Box sx={{ width: '25%'}}>
      <Stepper activeStep={currentSteps} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
