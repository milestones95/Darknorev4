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
  TextField,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import Button from "@material-ui/core/Button";
import React, { useRef, useEffect, Component } from 'react'
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import Grid from '@mui/material/Grid';
import {useAuthContext} from '../../contexts/auth-context';

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

function Row(props) {
  const { row } = props;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isOpen2, setIsOpen2 ] = useState(false);
  const [ isOpen3, setIsOpen3 ] = useState(false);
  const plainTextTestCase = useRef('') //creating a refernce for TextField Component
  const [code, setCode] = React.useState(props.code);

  const timestamp = props.testCase.created_at; // Replace this with your timestamp string

  const date = new Date(timestamp);
  const options = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  };
  const scenioCellColor = (props.testCase.scenarioType == "Happy Path") ? "#E7F8F3" : "#FAD4D4"


  const formattedDate = date.toLocaleDateString(undefined, options);
  return (
    <React.Fragment key={props.index}>
      <TableRow>
        <TableCell>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2">{props.testCase.content}</Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ background: scenioCellColor }}>
          {props.testCase.scenarioType}
        </TableCell>
        <TableCell>{formattedDate}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  testCase: PropTypes.arrayOf(
     PropTypes.shape({
       content: PropTypes.string.isRequired,
       created_datetime: PropTypes.string.isRequired,
       id: PropTypes.number.isRequired,
     }),
   ).isRequired,
   index: PropTypes.number.isRequired,
   code: PropTypes.string.isRequired,
};

export const ViewTestTable = (props) => {
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
    selected = []
  } = props;


  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const [ isOpen, setIsOpen ] = useState([]);
  const [ isOpen2, setIsOpen2 ] = useState(false);
  const [ testCases, setTestCases ] = useState([]);
  const [ automatedTests, setAutomatedTests] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {

    const fetchAutomatedTests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getTestAutomatedTests", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

        const data = await response.json();
        setAutomatedTests(data);
      } catch (error) {
        console.error('Failed to fetch automatedTests:', error);
        setAutomatedTests([]);
      }
    };

    const fetchTests = async () => {
      try {
        console.log("i was clicked");
        const response = await fetch(`http://localhost:5000/api/getTestScenarios/?user_id=${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

        const data = await response.json()
        setTestCases(data.tests);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
        setTestCases([]);
      }
    };

    fetchTests().then(fetchAutomatedTests());
  }, []);

  const plainTextTestCase = useRef('') //creating a refernce for TextField Component

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Scenario Type</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testCases && testCases.map((testCase, index) => {
                  console.log(testCase);
                  console.log(displayedScenarios)
                  if (displayedScenarios === 'All') {
                        return (
                      <Row key={index}
                        testCase={testCase}
                        index={index}
                      />
                    )
                  }
                  if (testCase.scenarioType === 'Happy Path'&& displayedScenarios === 'Happy Path') {
                        return (
                      <Row key={index}
                        testCase={testCase}
                        index={index}
                      />
                    )
                  }
                  if (testCase.scenarioType === 'Non-Happy Path' && displayedScenarios === 'Non-Happy Path') {
                        return (
                      <Row key={index}
                        testCase={testCase}
                        index={index}
                      />
                    )
                  }
                  if (testCase.scenarioType === 'Edge Case' && displayedScenarios === 'Edge Case') {
                        return (
                      <Row key={index}
                        testCase={testCase}
                        index={index}
                      />
                    )
                  }
                  return })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
