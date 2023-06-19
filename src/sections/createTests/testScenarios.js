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
                    <TableRow
                      hover
                    >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={false}

                      />
                      </TableCell>
                      <TableCell>
                        <Typography>
                          User enters a valid name and email address and submits the form successfully.
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          Happy Path
                        </Typography>
                      </TableCell>
                      <TableCell>
                          06/19/2023
                      </TableCell>
                    </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        </Grid>
        
      </Grid>
    </Card>
  );
};
