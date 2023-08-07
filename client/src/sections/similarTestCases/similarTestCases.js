import {
  Modal,
  Box,
  Button,
  Stack,
  SvgIcon,
  TextField,
  Avatar,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import Alert from "@mui/material/Alert";

import Grid from "@mui/material/Grid";
import {Scrollbar} from "src/components/scrollbar";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import {createNewProject} from "src/services/project";
import {useState, useContext} from "react";
import {Label} from "@mui/icons-material";
import {useAuth} from "src/hooks/use-auth";
import {TestCreationData} from "src/contexts/test-creation-context";
import {TestScenarios} from "src/sections/createTests/testScenarios";
import {generateSimilarTestCases, saveTestCases} from "src/services/testCase";
import {SelectScenario} from "../createTests/scenario-select";
import SimpleBar from "simplebar-react";
import {LoadingButton} from "@mui/lab";
import {useSelection} from "src/hooks/use-selection";
import {addTestCategory, getTestCategories} from "src/services/testCategory";

export const SimilarTestCases = props => {
  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const [showAlert, setShowAlert] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  const style = {
    position: "absolute",
    top: "20%",
    left: "45%",
    bottom: "0%",
    transform: "translate(-40%, -10%)",
    width: 1200,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 10,
    p: 0,
    padding: 30
  };

  const handleSubmitTestCases = async (event) => {
      event.preventDefault();
      setShouldShowLoader(true);

      const userStoryId = props.userStoryId;

      const promises = props.customerSelections.selected.map(async selection => {
        // Find the corresponding scenario object using the selection value
        const selectedScenario = props.testCases.find(
          scenario => scenario.test_case === selection
        );
  
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
      props.addTestCases(selectedItems);
      try {
        const response = await saveTestCases(selectedItems);
        if (response.status === 200) {
          props.setShowSimilarTestCasesModal(false);
          window.location.reload();
        }
      } catch (error) {
        console.log("Error while saving test cases:-", error);
      }
    };

  const handleAlertClose = () => {
    setShowAlert(false);
  }
  return (
    <Modal
      open={props.showSimilarTestCasesModal}
      onClose={() => props.setShowSimilarTestCasesModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card style={style}>
      <Grid xs={12}>
        <Stack spacing={1} style={{marginBottom: 20}}>
          <Typography variant="h4">Test Scenarios</Typography>
        </Stack>
        {showAlert &&
          <Alert severity="error" onClose={handleAlertClose}>
            Please select at least one of the scenario below
          </Alert>}
          <Grid xs={12} style={{marginBottom: 20}}>
            <SelectScenario
              setDisplayedScenarios={setDisplayedScenarios}
            />
          </Grid>
        <SimpleBar style={{maxHeight: 300}}>
          <TestScenarios
            items={props.testCases}
            onDeselectAll={props.customerSelections.handleDeselectAll}
            onDeselectOne={props.customerSelections.handleDeselectOne}
            onSelectAll={props.customerSelections.handleSelectAll}
            onSelectOne={props.customerSelections.handleSelectOne}
            selected={props.customerSelections.selected}
            displayedScenarios={displayedScenarios}
            existingTestCases={[]}
          />
        </SimpleBar>
        <Grid style={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "150px" }}>
          <LoadingButton
            type="submit"
            loading={shouldShowLoader}
            variant="contained"
            size="small"
            align="center"
            sx={{mt: 2}}
            onClick={handleSubmitTestCases}
          >
            Save Test Cases
          </LoadingButton>
        </Grid>
      </Grid>
      </Card>
    </Modal>
  )
};
