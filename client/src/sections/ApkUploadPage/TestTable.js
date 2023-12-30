import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Paper, Container, Typography } from "@mui/material";
import { CustomNoRowsOverlay } from "./StylesGridOverlay";
import { useRouter } from "next/navigation";

const TestTable = (props) => {
  console.log("🚀 ~ props:", props)
  const router = useRouter();

  const columns = [
    {
      field: "",
      headerName: "",
      type: "number",
      width: 140,
      sortable: false,
      type: "string",
      renderCell: (params) => {
        return (
          <Button
            variant="primary"
            style={{ 
              backgroundColor: '#e0e0e0',  // light grey
              color: 'black', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '10px',
            }}
            onClick={() => {
            }}
          >
            Assign To <br /> Jira Ticket
          </Button>
        );
      }
    },
    {
      field: "tName",
      headerName: "Name",
      width: 280,
      sortable: false,
      type: "string",
    },
    {
      field: "tStatus",
      headerName: "Status",
      width: 100,
      sortable: false,
      type: "string",
    },
    {
      field: "tTime",
      headerName: "Time",
      width: 180,
      sortable: false,
      type: "string",
    },
    {
      field: "tDetails",
      headerName: "Details",
      type: "number",
      width: 100,
      sortable: false,
      type: "string",
      renderCell: (params) => {
        return (
          <Button
            variant="text"
            onClick={() => {
              const details =  params.row.tDetails
              router.push({
                pathname: "/results",
                query: { data : JSON.stringify(details) },
              },
              "/results"
              );
            }}
          >
            View Results
          </Button>
        );
      },
    }
  ];

  return (
    <Container component="main">
      <Typography component="h1" variant="h5" pb={3}>
        Test Results
      </Typography>
      <Paper elevation={3} sx={{ p: 1 }}>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={props.data || []}
            columns={props.data ? columns : []}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            hideFooter
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
          />
        </div>
      </Paper>
    </Container>
  );
};

export default TestTable;
