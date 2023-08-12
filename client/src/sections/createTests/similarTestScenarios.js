import PropTypes from 'prop-types';
import { format } from 'date-fns';
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
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import {useContext, useEffect, useState} from 'react';
import {useSelection} from 'src/hooks/use-selection';
import {TestCreationData} from 'src/contexts/test-creation-context';
import {LoadingButton} from "@mui/lab";
import {generateSimilarTestCases} from 'src/services/testCase';
import {SimilarTestCases} from '../similarTestCases/similarTestCases';

export const SimilarTestScenarios = (props) => {
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [selectedSimilarTestCases, setSelectedSimilarTestCases] = useState([]);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [showSimilarTestCasesModal, setShowSimilarTestCasesModal] = useState(false);
  const [moreLikeThisButtonIndex, setMoreLikeThisButtonIndex] = useState(null);

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
    existingTestCases,
    setSimilarTestCases,
    similarTestCases,
    userStoryDetails,
    acceptanceCriteria,
    isForCreating,
  } = props;
  let updatedTestCases = [...similarTestCases];

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
                                setSimilarTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {props.isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
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
                                // setSimilarTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {props.isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
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
                                setSimilarTestCases(updatedTestCases);
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {props.isForDisplay ? customer.test_categories.name : customer.scenario_type}
                            </Typography>
                          </TableCell>
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
                            setSimilarTestCases(updatedTestCases);
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ background: scenioCellColor }}>
                        <Typography>
                          {props.isForDisplay ? customer.test_categories.name : customer.scenario_type}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    )
                    })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        </Grid>
      </Grid>
    </Card>
  );
};

SimilarTestScenarios.propTypes = {
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
