import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Grid, Typography, Button, Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Link from "next/link";
import { useAuth } from "src/hooks/use-auth";
import { getCurrentCompanyTestSuites, getCurrentUser } from "src/services/toDoServices";
import { useRouter } from "next/navigation";

const TestSuites = () => {
  const auth = useAuth();
  const router = useRouter();
  const [testSuites, setTestSuites] = useState([]);

  const fetchCurrentCompanyTestSuites = async (companyName) => {
    const response = await getCurrentCompanyTestSuites(companyName);
    console.log("Response --> ", response.data);
    setTestSuites(response.data);
  };

  const fetchData = async () => {
    const currentUser = await getCurrentUser(auth?.user?.id);
    fetchCurrentCompanyTestSuites(currentUser?.data?.company_name);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Test Suites | Darknore</title>
      </Head>

      <Grid container spacing={2} py={4} style={{ height: "100%", width: "100%" }}>
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
                  color="primary"
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
                  color="info"
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
        <Grid item xs={10} style={{ height: "100%", width: "100%" }} width={"100%"}>
          <Typography variant="h5" mb={3}>
            Test Suites
          </Typography>
          <Box style={{ width: "100%" }}>
            <Grid container spacing={5} style={{ height: "100%", width: "100%" }} width={"100%"}>
              {testSuites.map((testSuite) => {
                return (
                  <Grid item key={testSuite?.id} style={{ width: "100%" }} xs={12} md={4}>
                    <Box
                      sx={{ border: "1px solid lightgray", borderRadius: "10px", width: "100%" }}
                      p={1}
                      width={"100%"}
                    >
                      <Typography variant="h5" component="div" mb={2}>
                        Name: {testSuite.test_suite_name}
                      </Typography>
                      <Typography variant="body2" mb={1}>
                        Description: {testSuite.app_description}
                      </Typography>
                      <Typography variant="body2" mb={1}>
                        URL: {testSuite.url}
                      </Typography>
                      <Typography variant="body2" mb={1}>
                        Browser: {testSuite.browser}
                      </Typography>
                      <Typography variant="body2" mb={2}>
                        Company: {testSuite.company}
                      </Typography>
                      <Button size="small" variant="contained" fullWidth color="primary">
                        <Link
                          href={`/testCases/${testSuite?.id}`}
                          style={{ color: "white", textDecoration: "none" }}
                        >
                          View Test Cases
                        </Link>
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

TestSuites.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TestSuites;
