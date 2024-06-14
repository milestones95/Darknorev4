import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
  FormGroup
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Clear } from "@mui/icons-material";
import { getCurrentUser, getUserTestResults } from "src/services/toDoServices";
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

// Dummy data for test cases
const testCases = [
  {
    id: 1,
    name: "Test Case 1",
    status: "Passed",
    details: "This is test case 1 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    name: "Test Case 2",
    status: "Failed",
    details: "This is test case 2 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    name: "Test Case 3",
    status: "Pending",
    details: "This is test case 3 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    name: "Test Case 4",
    status: "Passed",
    details: "This is test case 4 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 5,
    name: "Test Case 5",
    status: "Failed",
    details: "This is test case 5 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 6,
    name: "Test Case 6",
    status: "Passed",
    details: "This is test case 6 details.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const TestCasesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [specs, setSpecs] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State for modal
  console.log("🚀 ~ specs:", specs);
  const classes = useStyles();

  const links = [
    { href: '/createTests', label: 'Create Test' },
    { href: '/testSuites', label: 'Test Suites' },
    { href: '/testReports', label: 'Test Reports' },
    { href: '/settings', label: 'Settings' },
  ];

  const auth = useAuth();
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleSaveAssertion = () => {
    // Add your logic to save assertion here
    console.log("Assertion saved!");
    setOpenModal(false); // Close the modal after saving assertion
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const currentUserResponse = await getCurrentUser(auth.user.id);
        const currentUser = currentUserResponse.data;
        console.log("Current User --> ", currentUser);

        const response = await getUserTestResults(currentUser.company_name);
        console.log("Test Case Response --> ", response);
        // const parsed = JSON.parse(response.data.json_result);
        // setSpecs(parsed.suites[0].specs);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "green";
      case "failed":
        return "red";
      case "pending":
        return "orange";
      default:
        return "inherit";
    }
  };

  const filteredTestCases = specs.filter(spec => {
    const titleMatch = spec.title.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === "" || spec.tests[0].results[0].status === filterStatus; // Assuming there's always one test and one result
    return titleMatch && statusMatch;
  }).map(spec => {
    const result = spec.tests[0].results[0]; // Assuming there's always one test and one result
    const startTime = new Date(result.startTime).toLocaleString(); // Convert startTime to a formatted string
    return {
      id: spec.id,
      name: spec.title,
      status: result.status,
      startTime: startTime,
      details: `Timeout: ${spec.tests[0].timeout} ms`
    };
  });;


  return (
    <>
      <Head>
        <title>Test Cases | Darknore</title>
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
          {/* Filter and Search */}
          <Box my={2}>
            <Typography variant="h6" mb={2}>All Test Cases</Typography>
            <Button onClick={() => {
              router.back();
            }} variant="outlined">Go Back</Button>
          </Box>
          <Grid container spacing={2} alignItems="center" style={{ marginBottom: "20px" }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Search Test Cases"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: searchTerm
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="passed">Passed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {/* Test Cases List */}
          {filteredTestCases.map((testCase) => (
            <Accordion
              key={testCase.id}
              sx={{
                marginBottom: "10px",
                paddingLeft: "20px",
                borderLeft: `10px solid ${testCase.status === "passed" ? "green" : testCase.status === "failed" ? "red" : "orange"}`,
                position: "relative", // Add this to make position relative for absolute positioning
              }}
            >
              <AccordionSummary style={{ justifyContent: "space-between" }}>
                <ListItemText primary={testCase.name} secondary={`Status: ${testCase.status}`} />
                {/* Button to open modal for adding assertions */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleModal}
                >
                  Add Assertion
                </Button>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{testCase.startTime}</Typography>
                <iframe
                  width="560"
                  height="315"
                  src={testCase.videoUrl}
                  title={testCase.name}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                {/* Button to run the test */}
                <Button
                  variant="contained"
                  color="primary"
                  style={{ position: "absolute", bottom: 10, right: 10 }}
                  onClick={() => runTest(testCase.id)} // Assuming you have a function to run the test
                >
                  Run Test
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
          {/* Modal for adding assertions */}
          <Modal open={openModal} onClose={handleModal}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", border: "2px solid #000", p: 4 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Add Assertion
              </Typography>
              <FormGroup>
                <TextField label="Description" fullWidth />
                <TextField label="Expected Value" fullWidth />
              </FormGroup>
              {/* Button to save assertion */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAssertion}
                style={{ marginTop: "10px" }}
              >
                Save Assertion
              </Button>
            </Box>
          </Modal>
          {/* Button to run all tests */}
          <Button variant="contained" color="primary" style={{ position: "fixed", bottom: 20, right: 20 }}>Run All Tests</Button>
        </Grid>
      </Grid>
    </>
  );
};

TestCasesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TestCasesPage;
