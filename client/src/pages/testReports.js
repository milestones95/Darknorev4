import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Grid, Typography, Container, Button, Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from 'next/router';
import TestChart from "src/sections/ApkUploadPage/TestChart"; // Update the path
import Link from "next/link";
import {
  getCurrentCompanyTestSuites,
  getCurrentUser,
  getUserTestResults,
} from "src/services/toDoServices";
import { useAuth } from "src/hooks/use-auth";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  sidebar: {
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  button: {
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: 'white',
    color: 'black',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover': {
      backgroundColor: '#6b18f4',
      color: 'white',
    },
  },
  activeButton: {
    backgroundColor: 'darkcyan',
    color: 'white',
  },
  listItem: {
    marginTop: '10px',
  },
});
const TestResultsPage = () => {
  const [testSuites, setTestSuites] = useState([]);
  const auth = useAuth();
  const classes = useStyles();
  const router = useRouter();

  const links = [
    { href: '/createTests', label: 'Create Test' },
    { href: '/testSuites', label: 'Test Suites' },
    { href: '/testReports', label: 'Test Reports' },
    { href: '/settings', label: 'Settings' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser(auth.user.id);

      const currentCompanyTestSuites = await getCurrentCompanyTestSuites(
        currentUser.data.company_name
      );
      console.log("Test Suites -> ", currentCompanyTestSuites.data);
      setTestSuites(currentCompanyTestSuites.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Test Reports | Darknore</title>
      </Head>

      <Grid container spacing={2} py={4} style={{ height: "100%" }}>
      <Grid item xs={2} className={classes.sidebar}>
          {/* Sidebar with multiple options */}
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {links.map((link) => (
              <li key={link.href} className={classes.listItem}>
                <Link href={link.href}>
                  <Button
                    variant="text"
                    fullWidth
                    className={`${classes.button} ${router.pathname === link.href ? classes.activeButton : ''}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ flex: 1 }}></div>
        </Grid>
        <Grid item xs={10}>
          <Box my={2}>
            <Typography variant="h5" mb={2}>
              Test Reports
            </Typography>
          </Box>
          <Grid container spacing={5} style={{ height: "100%", width: "100%" }} width={"100%"}>
            {testSuites.map((testSuite) => {
              const dateString = testSuite.created_at;
              const date = new Date(dateString);
              
              const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
              return (
                <Grid item key={testSuite?.id} xs={12} md={4}>
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
                      CreatedAt: {formattedDate}
                    </Typography>
                    <Button size="small" variant="contained" fullWidth color="primary">
                      <Link
                        href={`/testReports/${testSuite?.id}`}
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        View Test Reports
                      </Link>
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

TestResultsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TestResultsPage;
