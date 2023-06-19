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

export const TestSteps = (props) => {

  return (
    <Card>
    <Grid xs={12}>
      <Grid xs={12}>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Step
                  </TableCell>
                  <TableCell>
                    Test Step
                  </TableCell>
                  <TableCell>
                    Page
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    <TableRow
                      hover
                    >
                      <TableCell>
                        1
                      </TableCell>
                      <TableCell>
                        <TextField
                          required
                          id="outlined-required"
                          label="Test Step"
                          placeholder="Enter Test Step"
                        />
                      </TableCell>
                      <TableCell>
                      <TextField
                        required
                        select
                        id="outlined-required"
                        label="Choose Page"
                        placeholder="Choose Page"
                      />
                      </TableCell>
                    </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        </Grid>
        <Grid xs={12}>
            <Grid xs={12}>
              <Button variant="text">
              <Typography>
                Add New Test Step   
              </Typography>
              <AddCircleIcon />
              </Button>
            </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};
