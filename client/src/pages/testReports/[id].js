import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Grid, Typography, Container, Button, Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import TestChart from "src/sections/ApkUploadPage/TestChart"; // Update the path
import Link from "next/link";
import { getCurrentTestResult } from "src/services/toDoServices";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "next/router";

const TestResultsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [specs, setSpecs] = useState([]);
  const [testSuiteName, setTestSuiteName] = useState("");

  const auth = useAuth();
  console.log("🚀 ~ specs:", specs);
  // Dummy data for total, passed, and failed tests
  const totalTests = specs.length;
  const countTests = () => {
    let passedTests = 0;
    let failedTests = 0;

    // Iterate over specs to count passed and failed tests
    specs.forEach((spec) => {
      const result = spec.tests[0].results[0]; // Assuming there's always one test and one result
      if (result.status === "passed") {
        passedTests++;
      } else if (result.status === "failed") {
        failedTests++;
      }
    });

    return { passedTests, failedTests };
  };
  const { passedTests, failedTests } = countTests();
  // Chart data
  const chartData = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        label: "Test Results",
        data: [passedTests, failedTests],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { id } = router.query;
        const response = await getCurrentTestResult(id);
        console.log("Response --> ", response);
        setTestSuiteName(response.data?.test_suite_name);
        const parsed = JSON.parse(response.data.json_result);
        setSpecs(parsed.suites[0].specs);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchTests();
  }, []);

  return (
    <>
      <Head>
        <title>Test Reports | Darknore</title>
      </Head>

      <Grid container spacing={2} py={4} style={{ height: "100%" }}>
        <Grid
          item
          xs={2}
          style={{
            background: "linear-gradient(to bottom right, purple, cyan)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sidebar with multiple options */}
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li style={{ marginTop: "10px" }}>
              <Link href="/createTests">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Create Test
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/testSuites">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Test Suites
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/testReports">
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Test Reports
                </Button>
              </Link>
            </li>
            <li style={{ marginTop: "10px" }}>
              <Link href="/settings">
                <Button
                  variant="text"
                  color="info"
                  fullWidth
                  style={{ borderRadius: "10px", fontSize: "16px" }}
                >
                  Settings
                </Button>
              </Link>
            </li>
          </ul>
          <div style={{ flex: 1 }}></div>
        </Grid>
        <Grid item xs={10}>
          <Box my={2}>
            <Typography variant="h6" mb={2}>
              Report of {testSuiteName}
            </Typography>
            <Button
              onClick={() => {
                router.back();
              }}
              variant="outlined"
            >
              Go Back
            </Button>
          </Box>
          {/* Display total, passed, and failed tests */}
          <Container maxWidth="sm">
            <Typography variant="h3" align="center" gutterBottom>
              Reports
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
              Total Tests: {totalTests}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              Passed: {passedTests}
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              Failed: {failedTests}
            </Typography>
          </Container>
          {/* Render the TestChart component with chart data */}
          <Container maxWidth="sm">
            <TestChart chartData={chartData} />
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

TestResultsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TestResultsPage;
