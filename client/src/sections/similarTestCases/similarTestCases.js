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
import {saveTestCases} from "src/services/testCase";
import {SelectScenario} from "../createTests/scenario-select";
import SimpleBar from "simplebar-react";
import {LoadingButton} from "@mui/lab";
import {useSelection} from "src/hooks/use-selection";
import {addTestCategory, getTestCategories} from "src/services/testCategory";
import {SimilarTestScenarios} from "../createTests/similarTestScenarios";

export const SimilarTestCases = props => {
  const [displayedScenarios, setDisplayedScenarios] = useState("All");
  const [showAlert, setShowAlert] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const auth = useAuth();

  const {
    customerSelections,
    similarTestCases,
    setSimilarTestCases,
    setManuallyUpdatedTestCases,
    addTestCases,
    showSimilarTestCasesModal,
    setShowSimilarTestCasesModal,
    testCases,
    isForCreatingTestCases,
    manuallyUpdatedTestCases
  } = props;

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

    if (isForCreatingTestCases) {
      const testCases = customerSelections.selected.map(selection => {
        const selectedScenario = similarTestCases.find(
          scenario => scenario.test_case === selection
        );
        return {
          test_case: selectedScenario.test_case,
          scenario_type: selectedScenario.scenario_type
        }
      });
      auth.setSimilarTestCases(testCases);
      setManuallyUpdatedTestCases([...manuallyUpdatedTestCases, ...testCases]);
      setShouldShowLoader(false);
      setShowSimilarTestCasesModal(false);
    } else {
      const userStoryId = props.userStoryId;

      const promises = customerSelections.selected.map(async selection => {
        // Find the corresponding scenario object using the selection value
        const selectedScenario = similarTestCases.find(
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
      addTestCases(selectedItems);
      try {
        const response = await saveTestCases(selectedItems);
        if (response.status === 200) {
          setShowSimilarTestCasesModal(false);
          window.location.reload();
        }
      } catch (error) {
        setShouldShowLoader(false);
        console.log("Error while saving test cases:-", error);
      }
      setShouldShowLoader(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  }
  return (
    <Modal
      open={showSimilarTestCasesModal}
      onClose={() => setShowSimilarTestCasesModal(false)}
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
          <SimilarTestScenarios
            onDeselectAll={customerSelections.handleDeselectAll}
            onDeselectOne={customerSelections.handleDeselectOne}
            onSelectAll={customerSelections.handleSelectAll}
            onSelectOne={customerSelections.handleSelectOne}
            selected={customerSelections.selected}
            displayedScenarios={displayedScenarios}
            existingTestCases={[]}
            similarTestCases={similarTestCases}
            setSimilarTestCases={setSimilarTestCases}
            setManuallyUpdatedTestCases={setManuallyUpdatedTestCases}
            manuallyUpdatedTestCases={manuallyUpdatedTestCases}
            isForCreating={true}
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
            {!isForCreatingTestCases ? "Save Test Cases" : "Done"}
          </LoadingButton>
        </Grid>
      </Grid>
      </Card>
    </Modal>
  )
};
