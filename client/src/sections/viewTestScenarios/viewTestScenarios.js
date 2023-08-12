import PropTypes from "prop-types";
import {format} from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  SvgIcon
} from "@mui/material";
import {Scrollbar} from "src/components/scrollbar";
import {getInitials} from "src/utils/get-initials";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  deleteTestCase,
  generateSimilarTestCases,
  getTestCaseById,
  getTestCases,
  updateTestCase
} from "src/services/testCase";
import {LoadingButton} from "@mui/lab";
import {useContext, useEffect, useState} from "react";
import SnackBar from "src/components/snackBar";
import {CreateProject} from "../createProject/create-project";
import {SimilarTestCases} from "../similarTestCases/similarTestCases";
import {useSelection} from "src/hooks/use-selection";
import {TestCreationData} from "src/contexts/test-creation-context";

let testCases;
const data = [
  {
    scenario:
      "User enters a valid name and email address and submits the form successfully.",
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters a valid name and a valid email address with special characters and submits the form successfully.",
    scenarioType: "Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters an invalid name (e.g. numbers, special characters) and a valid email address and submits the form. The form should not be submitted and an error message should be displayed.",
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  },
  {
    scenario:
      "User enters a valid name and an invalid email address (e.g. missing '@' symbol, incorrect domain) and submits the form. The form should not be submitted and an error message should be displayed.",
    scenarioType: "Non-Happy Path",
    createdAt: "06/19/2023",
    testSteps: [{id: "", testStep: "", webpage: ""}]
  }
];

const getUserStoryId = () => {
  const searchTerm = new URLSearchParams(window.location.search);
  return searchTerm.get("userStoryId");
};

const testCasesTable = (
  props,
  scenioCellColor,
  customer,
  i,
  setSavingTestCase,
  setMoreLikeThisButtonIndex,
  shouldDisableDeleteButton,
  setShouldDisableDeleteButton,
  setTestCases,
  setSnackBar,
  setShowSimilarTestCasesModal,
  setSelectedTestCase,
  selectedTestCase,
  setSimilarTestCases,
  shouldShowLoader,
  setShouldShowLoader,
  moreLikeThisButtonIndex
) => {
  const {
    count = 0,
    displayedScenarios,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    scenarios,
  } = props;

  const formatDate = dateAndTime => {
    const date = new Date(dateAndTime);
    return date.toLocaleDateString("en-US");
  };

  function parseTestCases(string) {
    const jsonObject = JSON.parse(string);
    return jsonObject;
  }

  const getSimilarTestCases = async (selectedTestCaseId) => {
    try {
      const testCaseResponse = await getTestCaseById(selectedTestCaseId);
      if (testCaseResponse.status === 200) {
        const response = await generateSimilarTestCases({
          user_story: props.updatedUserStoryDetails,
          acceptance_criteria: props.updatedAcceptanceCriteria,
          test_case: testCaseResponse.data.test_case
        });
        if (response.ok) {
          const responseData = await response.json();
          setSimilarTestCases(parseTestCases(responseData.result.content).Test_Case_Scenarios);
        }
      }
    } catch (error) {
      console.log("Error while getting similar test cases:-", error);
    }
  };

  return (
    <TableRow key={i} hover>
      <TableCell>
        <TextField
          fullWidth
          name="userStoryDescription"
          multiline
          required
          style={{
            marginTop: 10,
            backgroundColor: "#fff",
            paddingLeft: 10,
            border: "1px solid #fff"
          }}
          defaultValue={customer && customer.test_case}
          id="standard-basic"
          variant="standard"
          InputProps={{
            disableUnderline: true // <== added this
          }}
          onChange={async event => {
            const testCaseId = customer.id;
            setTimeout(async () => {
              setSavingTestCase(true);
              try {
                const response = await updateTestCase(testCaseId, {
                  test_case: event.target.value
                });
              } catch (error) {
                console.error("Error while updating test case:-", error);
              }
              setSavingTestCase(false);
            }, 1500);
          }}
        />
      </TableCell>
      <TableCell sx={{background: scenioCellColor}}>
        <Typography>
          {customer.test_categories.name}
        </Typography>
      </TableCell>
      <TableCell>
        {formatDate(customer.created_at)}
      </TableCell>
      <TableCell>
        <Button
          style={{
            borderRadius: 10,
            width: 10,
            color: "#F04438"
          }}
          onClick={async () => {
            setShouldDisableDeleteButton(true);
            const result = await deleteTestCase(customer.id);
            if (result.status === 200) {
              setSnackBar({
                message: "SuccessFully Deleted The Test Case!",
                severity: "success"
              });
              setTestCases(
                testCases.filter(item => {
                  return item.id !== customer.id;
                })
              );
              setShouldDisableDeleteButton(false);
            } else {
              setSnackBar({
                message: "Error In Deleted The Test Case!",
                severity: "error"
              });
            }
          }}
          disabled={shouldDisableDeleteButton}
        >
          <RemoveIcon />
        </Button>
      </TableCell>
      <TableCell>
        <Container style={{display: "flex", padding: 0}}>
          <LoadingButton
            startIcon={
              <SvgIcon
                fontSize="small"
                style={{borderRadius: "10px", fontWeight: "bold"}}
              >
                <AddIcon />
              </SvgIcon>
            }
            onClick={async () => {
              setShouldShowLoader(true);
              setSelectedTestCase(customer.id);
              setMoreLikeThisButtonIndex(i);
              await getSimilarTestCases(customer.id);
              setShouldShowLoader(false);
              setShowSimilarTestCasesModal(true);
            }}
            variant="outlined"
            loading={shouldShowLoader && moreLikeThisButtonIndex === i}
          >
            More like this
          </LoadingButton>
        </Container>
      </TableCell>
    </TableRow>
  );
};

export const ViewTestScenarios = props => {
  const [savingTestCase, setSavingTestCase] = useState(false);
  const [moreLikeThisButtonIndex, setMoreLikeThisButtonIndex] = useState(null);
  const [shouldDisableDeleteButton, setShouldDisableDeleteButton] = useState(
    false
  );
  const [snackBar, setSnackBar] = useState(null);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [manuallyUpdatedTestCases, setManuallyUpdatedTestCases] = useState([]);

  const {
    count = 0,
    displayedScenarios,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    scenarios,
    setShowAutoSaveLoader,
    setTestCases,
    updatedUserStoryDetails,
    updatedAcceptanceCriteria,
    showSimilarTestCasesModal,
    setShowSimilarTestCasesModal,
    selectedTestCase,
    setSelectedTestCase,
    similarTestCases,
    setSimilarTestCases
  } = props;

  function parseTestCases(string) {
    const jsonObject = JSON.parse(string);
    return jsonObject;
  }

  const customerSelections = useSelection(testCases);
  const {addTestCases} = useContext(TestCreationData)


  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  testCases = items;

  return (
    <Card>
      {snackBar &&
        <SnackBar
          message={snackBar.message}
          severity={snackBar.severity}
          setSnackBar={setSnackBar}
        />}
      <Grid xs={12}>
        <Grid xs={12}>
          <Scrollbar>
            <Box sx={{minWidth: 800}}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                
                </TableCell> */}
                    <TableCell
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      Test Cases
                      {savingTestCase
                        ? <LoadingButton
                            style={{
                              color: "#6366F1",
                              backgroundColor: "#f5f6f9",
                              width: "100px",
                              paddingLeft: 30,
                              marginLeft: 10,
                              paddingTop: 0,
                              paddingBottom: 0
                            }}
                            loading={savingTestCase}
                            loadingPosition={"start"}
                          >
                            Saving...
                          </LoadingButton>
                        : null}
                    </TableCell>
                    <TableCell>Scenario Type</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>
                      {/* Delete */}
                    </TableCell>
                    <TableCell>
                      {/* Find Similar */}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testCases.map((customer, i) => {
                    const scenioCellColor =
                      customer.test_categories.name === "Happy Path"
                        ? "#E7F8F3"
                        : "#FAD4D4";
                    const isSelected = selected.includes(customer.test_case);
                    if (displayedScenarios == "Happy Path") {
                      if (customer.test_categories.name == "Happy Path") {
                        return testCasesTable(
                          props,
                          scenioCellColor,
                          customer,
                          i,
                          setSavingTestCase,
                          setMoreLikeThisButtonIndex,
                          shouldDisableDeleteButton,
                          setShouldDisableDeleteButton,
                          setTestCases,
                          setSnackBar,
                          setShowSimilarTestCasesModal,
                          setSelectedTestCase,
                          selectedTestCase,
                          setSimilarTestCases,
                          shouldShowLoader,
                          setShouldShowLoader,
                          moreLikeThisButtonIndex
                        );
                      }
                      return;
                    }

                    if (displayedScenarios == "Edge Case") {
                      if (customer.test_categories.name == "Edge Case") {
                        return testCasesTable(
                          props,
                          scenioCellColor,
                          customer,
                          i,
                          setSavingTestCase,
                          setMoreLikeThisButtonIndex,
                          shouldDisableDeleteButton,
                          setShouldDisableDeleteButton,
                          setTestCases,
                          setSnackBar,
                          setShowSimilarTestCasesModal,
                          setSelectedTestCase,
                          selectedTestCase,
                          setSimilarTestCases,
                          shouldShowLoader,
                          setShouldShowLoader,
                          moreLikeThisButtonIndex
                        );
                      }
                      return;
                    }
                    if (displayedScenarios == "Non-Happy Path") {
                      if (customer.test_categories.name == "Non-Happy Path") {
                        return testCasesTable(
                          props,
                          scenioCellColor,
                          customer,
                          i,
                          setSavingTestCase,
                          setMoreLikeThisButtonIndex,
                          shouldDisableDeleteButton,
                          setShouldDisableDeleteButton,
                          setTestCases,
                          setSnackBar,
                          setShowSimilarTestCasesModal,
                          setSelectedTestCase,
                          selectedTestCase,
                          setSimilarTestCases,
                          shouldShowLoader,
                          setShouldShowLoader,
                          moreLikeThisButtonIndex
                        );
                      }
                      return;
                    }
                    return testCasesTable(
                      props,
                      scenioCellColor,
                      customer,
                      i,
                      setSavingTestCase,
                      setMoreLikeThisButtonIndex,
                      shouldDisableDeleteButton,
                      setShouldDisableDeleteButton,
                      setTestCases,
                      setSnackBar,
                      setShowSimilarTestCasesModal,
                      setSelectedTestCase,
                      selectedTestCase,
                      setSimilarTestCases,
                      shouldShowLoader,
                      setShouldShowLoader,
                      moreLikeThisButtonIndex
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </Grid>
      </Grid>
      {showSimilarTestCasesModal ? <SimilarTestCases
        showSimilarTestCasesModal={showSimilarTestCasesModal}
        setShowSimilarTestCasesModal={setShowSimilarTestCasesModal}
        customerSelections={customerSelections}
        onDeselectAll={customerSelections.handleDeselectAll}
        onDeselectOne={customerSelections.handleDeselectOne}
        onSelectAll={customerSelections.handleSelectAll}
        onSelectOne={customerSelections.handleSelectOne}
        selected={customerSelections.selected}
        existingTestCases={[]}
        userStoryId={getUserStoryId()}
        addTestCases={addTestCases}
        similarTestCases={similarTestCases}
        setSimilarTestCases={setSimilarTestCases}
        manuallyUpdatedTestCases={testCases}
        setManuallyUpdatedTestCases={setManuallyUpdatedTestCases}
      /> : null}
    </Card>
  );
};

ViewTestScenarios.propTypes = {
  count: PropTypes.number,
  displayedScenarios: PropTypes.string,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
