import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  SvgIcon
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import {useContext, useState} from 'react';
import {useSelection} from 'src/hooks/use-selection';
import {LoadingButton} from "@mui/lab";
import {generateSimilarTestCases} from 'src/services/testCase';
import {SimilarTestCases} from '../similarTestCases/similarTestCases';
import {DataContext} from 'src/contexts/data-context';

export const TestScenarios = (props) => {
  const dataContext = useContext(DataContext);
  const userStory = dataContext.userStoryDetails;
  const [similarTestCases, setSimilarTestCases] = useState(JSON.stringify({}));
  const [selectedSimilarTestCases, setSelectedSimilarTestCases] = useState([]);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [showSimilarTestCasesModal, setShowSimilarTestCasesModal] = useState(false);
  const [moreLikeThisButtonIndex, setMoreLikeThisButtonIndex] = useState(null);

  const {
    displayedScenarios,
    onDeselectOne,
    onSelectOne,
    selected = [],
    setManuallyUpdatedTestCases,
    manuallyUpdatedTestCases,
    isForCreating,
    isForDisplay
  } = props;
  let updatedTestCases = [...manuallyUpdatedTestCases];

  const getSimilarTestCases = async (selectedTestCase, selectedScenarioType) => {
    try {
      const response = await generateSimilarTestCases({
        user_story: userStory.storyDetails,
        acceptance_criteria: userStory.acceptanceCriteria,
        test_steps: Object.values(dataContext.testSteps),
        test_case: selectedTestCase,
        scenario_type: selectedScenarioType
      });
      if (response.ok) {
        const responseData = await response.json();
        let newTestCases = [];
        if (Object.keys(responseData).length > 0) {
          newTestCases = parseTestCases(responseData.result.content).Test_Case_Scenarios;
        }
        
        setSimilarTestCases(newTestCases);
      }
    } catch (error) {
      console.log("Error while getting similar test cases:-", error);
    }
  }

  function parseTestCases(string) {
    const jsonObject = JSON.parse(string);
    return jsonObject;
  }

  const customerSelections = useSelection(manuallyUpdatedTestCases);

  return (
    <Card>
    <Grid xs={12}>
      <Grid xs={12}>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell padding="checkbox">
                
                </TableCell>
                  <TableCell>
                    Test Case
                  </TableCell>
                  <TableCell>
                    Scenario Type
                  </TableCell>
                  {!isForCreating ? <TableCell>
                  </TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
              {updatedTestCases.map((customer, i) => {
                const scenioCellColor = (customer.scenario_type == "Happy Path") ? "#E7F8F3" : "#FAD4D4"
                const isSelected = selected.includes(customer.test_case);

                if (displayedScenarios == "Happy Path") {
                  if (customer.scenario_type == "Happy Path") {
                    return(
                        <TableRow key={i}
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.test_case);
                              } else {
                                onDeselectOne?.(customer.test_case);
                              }
                            }}
                          />
                          </TableCell>
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
                              value={updatedTestCases.length > 0 && updatedTestCases[i].test_case}
                              id="standard-basic"
                              variant="standard"
                              InputProps={{
                                disableUnderline: true // <== added this
                              }}
                              onChange={async event => {
                                if (isSelected) {
                                  onDeselectOne?.(updatedTestCases[i].test_case);
                                }
                                updatedTestCases[i]["test_case"] = event.target.value;
                                setManuallyUpdatedTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
                          {!isForCreating ? <TableCell>
                          <Container style={{display: "flex", padding: 0, justifyContent: "center"}}>
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
                                setMoreLikeThisButtonIndex(i);
                                await getSimilarTestCases(customer.test_case, customer.scenario_type);
                                setShouldShowLoader(false)
                                setShowSimilarTestCasesModal(true);
                              }}
                              variant="outlined"
                              loading={shouldShowLoader && moreLikeThisButtonIndex === i}
                            >
                              More like this
                            </LoadingButton>
                          </Container>
                        </TableCell> : null}
                        </TableRow>
                        )
                    }
                    return
                }

                if (displayedScenarios == "Edge Case") {
                  if (customer.scenario_type == "Edge Case") {
                    return(
                        <TableRow key={i}
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.test_case);
                              } else {
                                onDeselectOne?.(customer.test_case);
                              }
                            }}
                          />
                          </TableCell>
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
                              value={updatedTestCases.length > 0 && updatedTestCases[i].test_case}
                              id="standard-basic"
                              variant="standard"
                              InputProps={{
                                disableUnderline: true // <== added this
                              }}
                              onChange={async event => {
                                if (isSelected) {
                                  onDeselectOne?.(updatedTestCases[i].test_case);
                                }
                                updatedTestCases[i]["test_case"] = event.target.value;
                                setManuallyUpdatedTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
                          {!isForCreating ? <TableCell>
                          <Container style={{display: "flex", padding: 0, justifyContent: "center"}}>
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
                                setMoreLikeThisButtonIndex(i);
                                await getSimilarTestCases(customer.test_case, customer.scenario_type);
                                setShouldShowLoader(false)
                                setShowSimilarTestCasesModal(true);
                              }}
                              variant="outlined"
                              loading={shouldShowLoader && moreLikeThisButtonIndex === i}
                            >
                              More like this
                            </LoadingButton>
                          </Container>
                        </TableCell> : null}
                        </TableRow>
                        )
                    }
                    return
                }
                if (displayedScenarios == "Non-Happy Path") {
                  if (customer.scenario_type == "Non-Happy Path") {
                    return(
                        <TableRow key={i}
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.test_case);
                              } else {
                                onDeselectOne?.(customer.test_case);
                              }
                            }}
                          />
                          </TableCell>
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
                              value={updatedTestCases.length > 0 && updatedTestCases[i].test_case}
                              id="standard-basic"
                              variant="standard"
                              InputProps={{
                                disableUnderline: true // <== added this
                              }}
                              onChange={async event => {
                                if (isSelected) {
                                  onDeselectOne?.(updatedTestCases[i].test_case);
                                }
                                updatedTestCases[i]["test_case"] = event.target.value;
                                setManuallyUpdatedTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
                          {!isForCreating ? <TableCell>
                          <Container style={{display: "flex", padding: 0, justifyContent: "center"}}>
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
                                setMoreLikeThisButtonIndex(i);
                                await getSimilarTestCases(customer.test_case, customer.scenario_type);
                                setShouldShowLoader(false)
                                setShowSimilarTestCasesModal(true);
                              }}
                              variant="outlined"
                              loading={shouldShowLoader && moreLikeThisButtonIndex === i}
                            >
                              More like this
                            </LoadingButton>
                          </Container>
                        </TableCell> : null}
                        </TableRow>
                        )
                    }
                    return
                }
                return(
                    <TableRow key={i}
                      hover
                    >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.test_case);
                          } else {
                            onDeselectOne?.(customer.test_case);
                          }
                        }}
                      />
                      </TableCell>
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
                          value={updatedTestCases.length > 0 && updatedTestCases[i].test_case}
                          id="standard-basic"
                          variant="standard"
                          InputProps={{
                            disableUnderline: true // <== added this
                          }}
                          onChange={async event => {
                            if (isSelected) {
                              onDeselectOne?.(updatedTestCases[i].test_case);
                            }
                            updatedTestCases[i]["test_case"] = event.target.value;
                            setManuallyUpdatedTestCases(updatedTestCases);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ background: scenioCellColor }}>
                        <Typography>
                          {isForDisplay ? customer.test_categories.name : customer.scenario_type}
                        </Typography>
                      </TableCell>
                      {!isForCreating ? <TableCell>
                        <Container style={{display: "flex", padding: 0, justifyContent: "center"}}>
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
                              setMoreLikeThisButtonIndex(i);
                              await getSimilarTestCases(customer.test_case, customer.scenario_type);
                              setShouldShowLoader(false)
                              setShowSimilarTestCasesModal(true);
                            }}
                            variant="outlined"
                            loading={shouldShowLoader && moreLikeThisButtonIndex === i}
                          >
                            More like this
                          </LoadingButton>
                        </Container>
                      </TableCell> : null}
                    </TableRow>
                    )
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
        similarTestCases={similarTestCases}
        setSimilarTestCases={setSimilarTestCases}
        isForCreatingTestCases={true}
        selectedSimilarTestCases={selectedSimilarTestCases}
        setSelectedSimilarTestCases={setSelectedSimilarTestCases}
        setManuallyUpdatedTestCases={setManuallyUpdatedTestCases}
        manuallyUpdatedTestCases={manuallyUpdatedTestCases}
      ></SimilarTestCases> : null}
    </Card>
  );
};

TestScenarios.propTypes = {
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
