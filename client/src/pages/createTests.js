import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Grid, TextField, Button, MenuItem, CircularProgress, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth";
import Link from "next/link";
import { getCurrentUser } from "src/services/toDoServices";
import { useRouter } from 'next/router';
import { baseUrl } from "src/utils/instanceAxios";
import axios from "axios";

const Page = () => {
  const [formData, setFormData] = useState({
    testSuiteName: "",
    url: "",
    username: "",
    password: "",
    browser: "",
    appDescription: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const auth = useAuth();
  const userId = auth?.user?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  console.log("formData", formData);
  const stringified = JSON.stringify(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const randomTestId = generateRandomId(); // Function to generate random ID
      const requestBody = {
        test_suite_id: randomTestId,
        user_id: userId,
        formData: stringified,
        company: currentUser?.company_name
      };
      const response = await axios.post(`${baseUrl}/`, requestBody);

      console.log("🚀 ~ response:", response)
      setTimeout(() => {
        setIsSubmitting(false); // Set submitting to false after successful submission
        router.push(`/testCases/${randomTestId}`);
      }, 120000);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error, such as displaying an error message to the user
      setIsSubmitting(false); // Set submitting to false in case of error
    }
  };

  const generateRandomId = () => {
    // Generate a random number or string as per your requirement
    // For example, generating a random number between 1 and 1000
    return Math.floor(Math.random() * 100000) + 1;
  };

  const fetchCurrentUser = async () => {
    const cUser = await getCurrentUser(auth?.user?.id);
    setCurrentUser(cUser?.data);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Head>
        <title>Create Tests | Darknore</title>
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
                  color="primary"
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
        <Grid item xs={10}>
          {/* Form for CreateTests option */}
          <Typography variant="h5" mb={3}>
            Create Test Suite
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Test Suite Name"
              name="testSuiteName"
              value={formData.testSuiteName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Browser"
              name="browser"
              value={formData.browser}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="Chrome">Chrome</MenuItem>
              <MenuItem value="Firefox">Firefox</MenuItem>
              <MenuItem value="Safari">Safari</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="App Description"
              name="appDescription"
              value={formData.appDescription}
              onChange={handleChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Create Test Suite
            </Button>
            {isSubmitting && (
              <div
                style={{
                  display: "flex",
                  background: "lightgreen",
                  alignItems: "center",
                  marginTop: "10px",
                  padding: "10px",
                }}
              >
                <CircularProgress size={24} style={{ marginRight: "10px" }} />
                <div>Testcases are being executed...</div>
              </div>
            )}
          </form>
        </Grid>
      </Grid>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
