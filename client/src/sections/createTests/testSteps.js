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
import React, { useRef, useEffect, Component } from 'react'
import { v4 as uuidv4 } from 'uuid';

function Row(props) {
  const { customer, index, indexOfScenarioArray, handleTypingInTextField, handleSelectingWebPage, handleRemove } = props;


  const handleRowRemove = () => {
    handleRemove(indexOfScenarioArray, customer.id);
  };
  return (
    <React.Fragment key={customer.id}>
        <TableRow id={uuidv4()}>
          <TableCell padding="checkbox">
            {props.index + 1}
          </TableCell>
          <TableCell>
            <TextField
              required
              onChange={(e) => {props.handleTypingInTextField(props.indexOfScenarioArray, props.index, e.target.value)}}
              label="Test Step"
              placeholder="Enter Test Step"
              multiline
              fullWidth
              defaultValue={props.customer.text}
            />
          </TableCell>
          <TableCell sx={{mr: 2}}>
          <TextField
            required
            select
            id={uuidv4()}
            label="Choose Page"
            placeholder="Choose Page"
            fullWidth
            value={props.customer.webpage}
            onChange={(e)=> {props.handleSelectingWebPage(props.indexOfScenarioArray, props.index, e.target.value)}}
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
             <Button id={uuidv4()} onClick={() => {handleRowRemove()}}>
              <CloseIcon />
             </Button>
          </TableCell>
        </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  customer: PropTypes.arrayOf(
     PropTypes.shape({
       id: PropTypes.string.isRequired,
        // testSteps: PropTypes.arrayOf(
            // PropTypes.shape({
            // id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            webpage: PropTypes.string.isRequired,
          // })
        // )
       }
     ),
   ).isRequired,
   index: PropTypes.number.isRequired,
   indexOfScenarioArray: PropTypes.number.isRequired,
};


export const TestSteps = (props) => {

  const {
    count = 0,
    handleRemove,
    indexOfScenarioArray,
    handleAddNewTestStep,
    handleTypingInTextField,
    handleSelectingWebPage,
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    scenario,
    selected = []
  } = props;

  return (
    <Grid xs={12}>
      <Grid xs={12}>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id={uuidv4()}>
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
              {scenario.testSteps.map((customer, i) => {
                return (
                  <Row
                    customer={customer}
                    index={i}
                    handleRemove={handleRemove}
                    indexOfScenarioArray={indexOfScenarioArray}
                    handleTypingInTextField={handleTypingInTextField}
                    handleSelectingWebPage={handleSelectingWebPage}
                  />
                  )
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        </Grid>
        <Grid xs={12}>
            <Grid xs={12}>
              <Button variant="text" onClick={() => props.handleAddNewTestStep(indexOfScenarioArray)}>
              <Typography>
                Add New Test Step
              </Typography>
              <AddCircleIcon sx={{ ml: 1 }}/>
              </Button>
            </Grid>
        </Grid>
      </Grid>
  );
};
