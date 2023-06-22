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
// import "@uiw/react-textarea-code-editor/dist.css";
import Grid from '@mui/material/Grid';

// const CodeEditor = dynamic(
//   () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
//   { ssr: false }
// );

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

  const [code, setCode] = React.useState(
      `/*
        * C# Program to Display All the Prime Numbers Between 1 to 100
        */

        using System;
        using System.Collections.Generic;
        using System.Linq;
        using System.Text;

        namespace VS
        {
          class Program
          {
            static void Main(string[] args)
            {
              bool isPrime = true;
              Console.WriteLine("Prime Numbers : ");
              for (int i = 2; i <= 100; i++)
              {
                for (int j = 2; j <= 100; j++)
                {
                  if (i != j && i % j == 0)
                  {
                    isPrime = false;
                    break;
                  }
                }

                if (isPrime)
                {
                  Console.Write("\t" +i);
                }
                isPrime = true;
              }
              Console.ReadKey();
            }
          }
        }
        `
    );

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const [ isOpen, setIsOpen ] = useState(false);
  const [ isOpen2, setIsOpen2 ] = useState(false);
  const [ tests, setTests ] = useState([]);


  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log("i was clicked");
        const response = await fetch("http://localhost:5000/api/getTestScenarios", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

          const data = await response.json();

        setTests(data.tests);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
        setTests([]);
      }
    };

    fetchTests();
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
              {tests.map((test, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle2">{test.content}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>11/12/1996</TableCell>
                    <TableCell padding="checkbox">
                      <Button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div align="right" style={{ background: "#EBEDF1" }}>
                          <Button variant="outlined" onClick={() => { navigator.clipboard.writeText(plainTextTestCase.current.value) }}>
                            Copy
                          </Button>
                        </div>
                        <TextField
                          id="outlined-multiline-static"
                          label="Multiline"
                          multiline
                          rows={4}
                          defaultValue="Default Value"
                          maxWidth
                          inputRef={plainTextTestCase}
                        />
                      </TableCell>
                    </TableRow>
                  </Collapse>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};