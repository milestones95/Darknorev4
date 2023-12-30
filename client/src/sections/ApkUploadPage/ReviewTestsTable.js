import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Button,
  styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from "@mui/lab";

const StyledTableCell = styled(TableCell)({
  background: '#f5f5f5', // Light gray background
});

const StyledDeleteButton = styled(IconButton)({
  color: 'red',
});

const StyledTextField = styled(TextField)({
  width: '100%', // Increase width of the input field
  backgroundColor: 'white', // White background color for the input field
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px', // Adjust the margin as needed
});

const staticTestNames = [
  'Click on Events Tab',
  'Click the new EventButton',
  'Type "Tech Talk" into the event field',
  'Type "Learning fundamentals of testing" into event description',
  'Click the category button',
  'From the category popup menu select Education',
  'Click on the Upload Button',
  'Click the create event button',
];

const StaticTableForm = ({ onGenerateTests, loading }) => {
  const [steps, setSteps] = useState(
    staticTestNames.map((testName, index) => ({
      step: `Step ${index + 1}`,
      testName,
    }))
  );

  const handleAddStep = () => {
    const newStep = { step: `Step ${steps.length + 1}`, testName: `Test ${steps.length + 1}` };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (step) => {
    const updatedSteps = steps.filter((s) => s.step !== step);
    setSteps(updatedSteps);
  };

  const handleTestNameChange = (step, value) => {
    const updatedSteps = steps.map((s) =>
      s.step === step ? { ...s, testName: value } : s
    );
    setSteps(updatedSteps);
  };

  return (
    <>
    <h3>Test 1</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Steps</StyledTableCell>
              <StyledTableCell>Test Name</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step.step}>
                <StyledTableCell>{step.step}</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={step.testName}
                    onChange={(e) => handleTestNameChange(step.step, e.target.value)}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledDeleteButton onClick={() => handleDeleteStep(step.step)}>
                    <DeleteIcon />
                  </StyledDeleteButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outlined" onClick={handleAddStep}>
          Add New Step +
        </Button>
      </TableContainer>

      <h3 style={{marginTop: "30px"}}>Test 2</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Steps</StyledTableCell>
              <StyledTableCell>Test Name</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step) => (
              <TableRow key={step.step}>
                <StyledTableCell>{step.step}</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={step.testName}
                    onChange={(e) => handleTestNameChange(step.step, e.target.value)}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledDeleteButton onClick={() => handleDeleteStep(step.step)}>
                    <DeleteIcon />
                  </StyledDeleteButton>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outlined" onClick={handleAddStep}>
          Add New Step +
        </Button>
      </TableContainer>

      <ButtonContainer>
        <LoadingButton
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              loadingPosition="start"
              onClick={onGenerateTests}
              sx={{ mt: 2 }}
            >
              Save and Run
            </LoadingButton>
      </ButtonContainer>
    </>
  );
};

export default StaticTableForm;
