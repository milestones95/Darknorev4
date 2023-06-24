import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const TestScenarios = (props) => {

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
    scenarios
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  console.log("items: " + items);

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
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                  <TableCell>
                    Test Scenario
                  </TableCell>
                  <TableCell>
                    Scenario Type
                  </TableCell>
                  {/* <TableCell>
                    Created Date
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
              {items.map((customer, i) => {
                console.log("items: " + items)
                console.log("customer: " + customer)
                var scenarioType, scenario = customer.split(":")
                console.log(scenarioType, " ", scenario)
                const scenioCellColor = (scenario[0] == "Happy Path") ? "#E7F8F3" : "#FAD4D4"
                const isSelected = selected.includes(customer);

                if (displayedScenarios == "Happy Path") {
                  if (scenario[0] == "Happy Path") {
                    return(
                        <TableRow
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.testScenario);
                              } else {
                                onDeselectOne?.(customer.testScenario);
                              }
                            }}
                          />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {scenario[1]}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {scenario[0]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                              {customer.createdAt}
                          </TableCell>
                        </TableRow>
                        )
                    }
                    return
                }

                if (displayedScenarios == "Edge Case") {
                  if (scenario[0] == "Edge Case") {
                    return(
                        <TableRow
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.testScenario);
                              } else {
                                onDeselectOne?.(customer.testScenario);
                              }
                            }}
                          />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {scenario[1]}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {scenario[0]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                              {customer.createdAt}
                          </TableCell>
                        </TableRow>
                        )
                    }
                    return
                }
                if (displayedScenarios == "Non-Happy Path") {
                  if (scenario[0] == "Non-Happy Path") {
                    return(
                        <TableRow
                          hover
                        >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(customer.testScenario);
                              } else {
                                onDeselectOne?.(customer.testScenario);
                              }
                            }}
                          />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {scenario[1]}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ background: scenioCellColor }}>
                            <Typography>
                              {scenario[0]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                              {customer.createdAt}
                          </TableCell>
                        </TableRow>
                        )
                    }
                    return
                }
                return(
                    <TableRow
                      hover
                    >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer);
                          } else {
                            onDeselectOne?.(customer);
                          }
                        }}
                      />
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {scenario[1]}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ background: scenioCellColor }}>
                        <Typography>
                          {scenario[0]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                          {customer.createdAt}
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