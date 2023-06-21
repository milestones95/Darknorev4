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
import React, { useRef, Component } from 'react'
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import Grid from '@mui/material/Grid';

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

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


  const plainTextTestCase = useRef('') //creating a refernce for TextField Component

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Created Date
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

            <TableRow>
              <TableCell>
                <Stack
                    direction="row"
                    spacing={2}
                  >
                  <Typography variant="subtitle2">
                      Plain English Test Case
                    </Typography>
                  </Stack>
                  </TableCell>
                  <TableCell>
                    11/12/1996
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Button
                      onClick={() => {
                        if (isOpen) {
                          setIsOpen(false)
                        }
                        else {
                          setIsOpen(true)
                        }
                      }
                    }

                    >
                      {(isOpen) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                  </TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={3}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <div style={{
                          background: "#EBEDF1",
                        }}>
                          <Button variant="outlined" onClick={() => {navigator.clipboard.writeText(plainTextTestCase.current.value)}}>
                              Copy
                          </Button>
                        </div>
                        <div style={{

                        }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Plain English Test Case"
                            multiline
                            rows={4}
                            sx={{width: "100%"}}
                            inputRef={plainTextTestCase}
                          />
                        </div>
                    </Collapse>
                    </TableCell>
                  </TableRow>
            <TableRow>
              <TableCell>
                <Stack
                    direction="row"
                    spacing={2}
                  >
                  <Typography variant="subtitle2">
                      Automated Test Case
                    </Typography>
                  </Stack>
                  </TableCell>
                  <TableCell>
                    11/12/1996
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Button
                      onClick={() => {
                        if (isOpen2) {
                          setIsOpen2(false)
                        }
                        else {
                          setIsOpen2(true)
                        }
                      }
                    }

                    >
                      {(isOpen2) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                  </TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                      <Collapse in={isOpen2} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1}}>
                        <div align="right" style={{
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
                                fullWidth
                              />
                            </Box>
                    </Collapse>
                    </TableCell>
                  </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
