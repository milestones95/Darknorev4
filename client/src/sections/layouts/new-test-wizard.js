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
  const [currentSteps, setCurrentSteps] = useState((1));

  useEffect(() => {
    if (window.location.pathname.startsWith('/createTests'))
      setCurrentSteps((1))
    if (window.location.pathname.startsWith('/testScenarioPage'))
        setCurrentSteps((1,2))
    if (window.location.pathname.startsWith('/testStepsPage'))
        setCurrentSteps((1,2,3))
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
