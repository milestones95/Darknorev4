import {
  Modal,
  Button,
  Stack,
  SvgIcon,
  TextField,
  Card,
  Typography
} from "@mui/material";
import Alert from "@mui/material/Alert";

import Grid from "@mui/material/Grid";
import {useContext, useState} from "react";
import SimpleBar from "simplebar-react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {DataContext} from "src/contexts/data-context";
import {updateUserStory} from "src/services/userStory";

export const TestSteps = props => {
  const dataContext = useContext(DataContext);
  let existingTestSteps = {...props.testStepsObj};
  delete existingTestSteps["0"];
  const firstExistingStep = {
    "0":
      Object.values(props.testStepsObj).length > 0
        ? Object.values(props.testStepsObj)["0"]
        : ""
  };
  const [testSteps, setTestSteps] = useState(existingTestSteps);
  const [firstStep, setFirstStep] = useState(firstExistingStep);
  const [showAlert, setShowAlert] = useState(false);

  const getMaxHeight = () => {
    const testStepsCount = Object.keys(testSteps).length;
    let maxHeight = 210;
    if (testStepsCount < 1) {
      maxHeight = 210;
    } else if (testStepsCount === 1) {
      maxHeight = 270;
    } else if (testStepsCount === 2) {
      maxHeight = 340;
    } else if (testStepsCount === 3) {
      maxHeight = 400;
    } else {
      maxHeight = 440;
    }
    if (showAlert) {
      maxHeight += 55;
    }
    return maxHeight;
  };

  const getTopPosition = () => {
    const testStepsCount = Object.keys(testSteps).length;
    let topPosition = 30;
    if (testStepsCount < 1) {
      topPosition = 30;
    } else if (testStepsCount === 1) {
      topPosition = 25;
    } else if (testStepsCount === 2) {
      topPosition = 20;
    } else if (testStepsCount === 3) {
      topPosition = 15;
    } else {
      topPosition = 10;
    }
    if (showAlert) {
      topPosition -= 5;
    }
    return topPosition;
  };

  function getOrdinal(n) {
    let ord = "th";
    if (n % 10 == 1 && n % 100 != 11) {
      ord = "st";
    } else if (n % 10 == 2 && n % 100 != 12) {
      ord = "nd";
    } else if (n % 10 == 3 && n % 100 != 13) {
      ord = "rd";
    }
    return ord;
  }

  const style = {
    position: "absolute",
    top: `${getTopPosition()}%`,
    left: "45%",
    bottom: "0%",
    transform: "translate(-40%, 10%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 10,
    p: 0,
    padding: 30,
    maxHeight: getMaxHeight()
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const showAlertsMessage = () => {
    return (
      <Alert severity="error" onClose={handleAlertClose}>
        Please fill in all of the steps or remove empty steps.
      </Alert>
    );
  };

  const handleUpdateTestSteps = async updatedTestSteps => {
    try {
      const testSteps = Object.values(updatedTestSteps);
      const response = await updateUserStory(props.userStoryId, {
        test_steps: testSteps
      });
      if (response.data) {
        props.setTestStepsObj(response.data[0].test_steps);
        dataContext.setTestSteps({});
      }
    } catch (error) {
      console.log("Error while updating test steps:", error);
    }
  };

  const showTestStepsInputBoxes = () => {
    return Object.keys(testSteps).map((value, index) => {
      return (
        <Grid
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <TextField
            name={`testStep${index}`}
            required
            label={`Enter ${index + 2}${getOrdinal(index + 2)} step`}
            style={{margin: 5, width: "90%"}}
            onChange={event => {
              if (props.isForUpdating) {
                testSteps[value] = event.target.value;
                setTestSteps({...testSteps});
              } else {
                testSteps[value] = event.target.value;
                setTestSteps({...testSteps});
              }
            }}
            disabled={firstStep === ""}
            value={Object.values(testSteps).length > 0 && testSteps[value]}
          />
          <Button
            startIcon={
              <SvgIcon fontSize="large">
                <RemoveIcon />
              </SvgIcon>
            }
            onClick={() => {
              delete testSteps[value];
              setTestSteps({...testSteps});
            }}
            style={{paddingRight: 0, paddingLeft: 14, width: "10px"}}
          />
        </Grid>
      );
    });
  };

  return (
    <Modal
      open={props.isAddingTestCases}
      onClose={() => props.setIsAddingTestCases(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card style={style}>
        <Grid xs={12}>
          <Stack spacing={1} style={{marginBottom: 10}}>
            <Typography variant="h4">Test Steps</Typography>
          </Stack>
          {showAlert ? showAlertsMessage() : null}
          <SimpleBar style={{maxHeight: 300}}>
            <TextField
              label={`Enter 1st step`}
              style={{margin: 5, width: "96%"}}
              onChange={event => {
                setFirstStep({0: event.target.value});
              }}
              defaultValue={firstStep["0"]}
            />
            {showTestStepsInputBoxes()}
          </SimpleBar>
          <Grid
            xs={12}
            container
            style={{
              marginTop: "10px",
              display: "flex",
              backgroundColor: "#fff"
            }}
          >
            <Grid xs={8} style={{backgroundColor: "#fff"}}>
              <Button
                endIcon={
                  <SvgIcon>
                    <AddIcon />
                  </SvgIcon>
                }
                onClick={() => {
                  const keys = Object.keys(testSteps);
                  const count =
                    keys.length === 0 ? 1 : Number(keys[keys.length - 1]) + 1;
                  const obj = {};
                  obj[count] = "";
                  setTestSteps({...testSteps, ...obj});
                }}
              >
                Add
              </Button>
            </Grid>
            <Grid
              xs={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#fff"
              }}
            >
              <Button
                variant="contained"
                onClick={async () => {
                  if (
                    Object.values({...firstStep, ...testSteps}).filter(
                      obj => obj === ""
                    ).length > 0
                  ) {
                    setShowAlert(true);
                  } else {
                    if (props.isForDisplay) {
                      await handleUpdateTestSteps({...firstStep, ...testSteps});
                    } else {
                      props.setSelectedTestSteps({...firstStep, ...testSteps});
                    }
                    dataContext.setTestSteps({...firstStep, ...testSteps});
                    props.setIsAddingTestCases(false);
                  }
                }}
                style={{marginRight: 10}}
              >
                Done
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  );
};
