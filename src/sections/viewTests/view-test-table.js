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
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import Button from "@material-ui/core/Button";
import React from "react";
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
                      Plain English Tests
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
                    <KeyboardArrowDownIcon />
                  </Button>
                  </TableCell>
                  </TableRow>
                  <TableRow>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1}} align="center">

                          <CodeEditor
                          component="div"
                            value={code}
                            language="csharp"
                            placeholder="Please enter C# code."
                            onChange={(evn) => setCode(evn.target.value)}
                            padding={15}
                            style={{
                              width:"100%",
                              fontSize: 12,
                              backgroundColor: "#121212",
                              fontFamily:
                                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"

                            }}
                          />
                          </Box>
                </Collapse>
                </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

// <TableRow
// >
// <Button
//   onClick={() => {
//     if (isOpen2) {
//       setIsOpen2(false)
//     }
//     else {
//       setIsOpen2(true)
//     }
//   }
// }
// >
//
//     <TableCell padding="checkbox">
//     </TableCell>
//     <TableCell>
//       <Stack
//         alignItems="center"
//         direction="row"
//         spacing={2}
//       >
//         <Typography variant="subtitle2">
//           Plain English Tests
//         </Typography>
//       </Stack>
//     </TableCell>
//     <TableCell>
//       11/12/1996
//     </TableCell>
// </Button>
// </TableRow>
//
// <Collapse in={isOpen2} component="tr" style={{ display: "block" }}>
//   <TableRow >
//     <td>
//       <div>
//         <CodeEditor
//           value={code}
//           language="csharp"
//           placeholder="Please enter C# code."
//           onChange={(evn) => setCode(evn.target.value)}
//           padding={15}
//           style={{
//             fontSize: 12,
//             backgroundColor: "#121212",
//             fontFamily:
//               "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
//           }}
//         />
//       </div>
//     </td>
//   </TableRow>
// </Collapse>
