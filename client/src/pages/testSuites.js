import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Grid, Typography, Button, Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Link from "next/link";
import { useAuth } from "src/hooks/use-auth";
import { getCurrentCompanyTestSuites, getCurrentUser } from "src/services/toDoServices";
import { useRouter } from 'next/router';
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

const TestSuites = () => {
  const auth = useAuth();
  const router = useRouter();
  console.log("🚀 ~ router:", router)
  const [testSuites, setTestSuites] = useState([]);
  const classes = useStyles();

  const links = [
    { href: '/createTests', label: 'Create Test' },
    { href: '/testSuites', label: 'Test Suites' },
    { href: '/testReports', label: 'Test Reports' },
    { href: '/settings', label: 'Settings' },
  ];

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
        <Grid item xs={10} style={{ height: "100%", width: "100%" }} width={"100%"}>
          <Typography variant="h5" mb={3}>
            Test Suites
          </Typography>
          <Box style={{ width: "100%" }}>
            <Grid container spacing={5} style={{ height: "100%", width: "100%" }} width={"100%"}>
              {testSuites.map((testSuite) => {
                const dateString = testSuite.created_at;
                const date = new Date(dateString);
                
                const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
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
                        CreatedAt: {formattedDate}
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
