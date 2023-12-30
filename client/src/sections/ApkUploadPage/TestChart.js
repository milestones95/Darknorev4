import React, { useState } from "react";
import { Paper, Container, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TestChart = (props) => {
  const { chartData } = props;

  return (
    <Container component="main">
      <Typography component="h1" variant="h5" pb={3}>
        Test Chart
      </Typography>
      <Paper elevation={3} sx={{ p: 1 }}>
        <Pie data={chartData} />
      </Paper>
    </Container>
  );
};

export default TestChart;
