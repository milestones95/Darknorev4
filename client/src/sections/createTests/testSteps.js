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
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';

export const TestSteps = (props) => {

  const {
    count = 0,
    handleRemove,
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

  return (
    <Grid xs={12}>
      <Grid xs={12}>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    Step
                  </TableCell>
                  <TableCell>
                    Test Step
                  </TableCell>
                  <TableCell sx={{mr: 2}}>
                    Page
                  </TableCell>
                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>
              <TableBody>
              {items.map((customer, i) => {
                console.log(customer)
                const createdAt = customer.createdAt;
                const scenioCellColor = (customer.scenarioType == "Happy Path") ? "#E7F8F3" : "#FAD4D4"
                const isSelected = selected.includes(customer.testScenario);
                return (
                    <TableRow
                    >
                      <TableCell padding="checkbox">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <TextField
                          required
                          id="outlined-required"
                          label="Test Step"
                          placeholder="Enter Test Step"
                          multiline
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{mr: 2}}>
                      <TextField
                        required
                        select
                        id="outlined-required"
                        label="Choose Page"
                        placeholder="Choose Page"
                        fullWidth
                      >
                        <MenuItem key="testpage1" value="testpage1">
                              testpage1.com
                        </MenuItem>
                        <MenuItem key="testpage2" value="testpage2">
                              testpage2.com
                        </MenuItem>
                      </TextField>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <div align="center">
                         <Button id={customer.id} onClick={event => handleRemove(event.target.id)}>
                          <CloseIcon />
                         </Button>
                        </div>
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
  );
};
