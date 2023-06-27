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

  const formattedDate = date.toLocaleDateString(undefined, options);
  return (
    <React.Fragment key={props.index}>
      <TableRow>
        <TableCell>
          <Stack direction="row" spacing={2}>
            <Typography variant="subtitle2">{props.testCase.content}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{formattedDate}</TableCell>
        <TableCell padding="checkbox">
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Table>
              <TableHead>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Typography variant="subtitle2">Automated Test Case</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Button onClick={() => setIsOpen3(!isOpen3)}>
                      {isOpen3 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                      <Collapse in={isOpen3} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1}}>
                        <div  align="right" style={{
                        background: "#EBEDF1",
                        }}>
                        <Button variant="outlined" onClick={() => {navigator.clipboard.writeText(code)}}>
                            Copy
                        </Button>
                        </div>
                        <CodeEditor
                        component="div"
                              value={code}
                              language="csharp"
                              placeholder="Please enter C# code."
                              onChange={(evn) => setCode(evn.target.value)}
                              padding={15}
                              style={{
                                fontSize: 12,
                                backgroundColor: "#F9E9B9",
                                fontFamily:
                                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                              }}
                            />
                          </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </Collapse>
      </TableCell>
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
        const response = await fetch("http://localhost:5000/api/getTestScenarios", {
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
                <TableCell>Created Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testCases.map((testCase, index) => {
                  console.log(testCase);
                  console.log(automatedTests);
                  var code = {}
                  if (automatedTests.length !== 0) {
                     code = automatedTests[0].filter(
                      (test) => test.test_case_id === testCase.id
                    )[0].test_content
                    console.log(code)
                  }
                  return (
                <Row
                  testCase={testCase}
                  index={index}
                  code={code}
                />
              )})}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
