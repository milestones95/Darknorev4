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
import { SQS } from 'aws-sdk';
// import io from 'socket.io-client';

// const socket = io('http://localhost:1234'); 

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
  const [testId, setTestId] = useState(null);
  console.log("🚀 ~ testId:", testId)
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
  

  const awsConfig = {
    accessKeyId: 'AKIA5JESYAD34TSONFN7',
    secretAccessKey: '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',
    region: 'eu-central-1',
  };
  

  const sqs = new SQS(awsConfig);

// Function to send a message to SQS
async function sendMessageToSQS(requestBody) {
  const params = {
    QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/912988307703/darknore-createTests',
    MessageBody: JSON.stringify(requestBody), // Serialize request body to JSON
  };

  try {
    const data = await sqs.sendMessage(params).promise();
    console.log('Message sent to SQS:', data.MessageId);
    return true;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    return false;
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

      const randomTestId = generateRandomId(); // Function to generate random ID
      setTestId(randomTestId)
      const requestBody = {
        test_suite_id: randomTestId,
        user_id: userId,
        formData: formData,
        company: currentUser?.company_name
      };
      sendMessageToSQS(requestBody)
        .then(success => {
          if (success) {
            console.log('Message sent successfully');
          } else {
            console.log('Failed to send message');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
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

//   useEffect(() => {
//     // Listen for notifications from the server
//     socket.on('notification', (data) => {
//         console.log('Notification received:', data);
//         // You can update state, show a notification, etc. based on the received data
//     });

//     return () => {
//         // Clean up on unmount
//         socket.disconnect();
//     };
// }, []);

const [notification, setNotification] = useState(null);
console.log("🚀 ~ notification:", notification)

useEffect(() => {
    const ws = new WebSocket('ws://18.185.177.253:7000');

    ws.onopen = function () {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("🚀 ~ data:", data)
        console.log("🚀 ~ testId:", testId)
        if (data.userId == userId){
          console.log("inside IF");
          setNotification(data.testId);
          setIsSubmitting(false);
          router.push(`/testCases/${data.testId}`);
        }
    };

    return () => {
        ws.close();
    };
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
