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
import Grid from '@mui/material/Grid';

export const TestScenarios = (props) => {

  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);


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
                  <TableCell>
                    Created Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {items.map((customer, i) => {
                console.log(customer)
                const createdAt = customer.createdAt;
                const scenioCellColor = (customer.scenarioType == "Happy Path") ? "#E7F8F3" : "#FAD4D4"
                const isSelected = selected.includes(customer.testScenario);

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
                          {customer.testScenario}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ background: scenioCellColor }}>
                        <Typography>
                          {customer.scenarioType}
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