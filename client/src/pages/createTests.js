import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import { supabase } from "./api/SupabaseClient";
// import io from 'socket.io-client';

// const socket = io('http://localhost:1234'); 

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
  const classes = useStyles();

  const links = [
    { href: '/createTests', label: 'Create Test' },
    { href: '/testSuites', label: 'Test Suites' },
    { href: '/testReports', label: 'Test Reports' },
    { href: '/settings', label: 'Settings' },
  ];
  const stringified = JSON.stringify(formData);
  

  const awsConfig = {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
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

async function listenForProcessCompletion(uniqueId, setIsSubmitting) {
  
const subscription = supabase.channel('custom-insert-channel')
.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'test-suite-result' },
  (payload) => {
    if (payload.new.id === uniqueId) {
      // Notify the frontend
      setIsSubmitting(false); // Set submitting to false
      router.push(`/testCases/${uniqueId}`);
    }
    console.log('Change received!', payload)
  }
)
.subscribe()



  return subscription;
}

function cleanupSubscription(subscription) {
  subscription.unsubscribe();
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

      axios.post(`${baseUrl}/create-test-suite`, requestBody)
      .then((response) => {
        console.log('response received')
        const testData = response.data.data; // Access the data array from response
        setIsSubmitting(false); // Set submitting to false after successful submission
    
        // Navigate to page 2 with the testData
        const navigate = useNavigate();
        navigate(`/testCases`, { state: { testData } });
      })
      .catch((error) => {
        console.error("Error occurred during axios request:", error);
        setIsSubmitting(false); // Set submitting to false after error
      });
  };
  
    // Cleanup subscription on component unmount
    useEffect(() => {
      let subscription;
  
      if (testId) {
        (async () => {
          subscription = await listenForProcessCompletion(testId, setIsSubmitting);
        })();
      }
  
      return () => {
        if (subscription) {
          cleanupSubscription(subscription);
        }
      };
    }, [testId]);

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

// useEffect(() => {
//   console.log("🚀 ~ web effet:")
//     const ws = new WebSocket('ws://api.darknore.ai');
//     ws.addEventListener('open', () => {
//       console.log('Connected to WebSocket server11');
//       // setSocket(socket);
//     });

//     ws.onopen = function () {
//         console.log('Connected to WebSocket server');
//     };

//     ws.onmessage = function (event) {
//         const data = JSON.parse(event.data);
//         console.log("🚀 ~ data:", data)
//         console.log("🚀 ~ testId:", testId)
//         if (data.userId == userId){
//           console.log("inside IF");
//           setNotification(data.testId);
//           setIsSubmitting(false);
//           router.push(`/testCases/${data.testId}`);
//         }
//     };

//     return () => {
//         ws.close();
//     };
// }, []);

  return (
    <>
      <Head>
        <title>Create Tests | Darknore</title>
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
