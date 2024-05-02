// ApkUploadPage.js
import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { CloudUploadOutlined, FileUploadOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TestPhrases } from "src/utils/test-phrases";
import { getAllSessions, createSessionData, updateUserSession } from "../../services/appTesting";
import { useAuth } from "src/hooks/use-auth";

const ApkUploadPage = (props) => {
  const { onComplete = () => {} } = props;
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const fileInputRef = useRef(null);
  const auth = useAuth();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        return;
      }

      setLoading(true);
      const appName = "mahek_test";
      const formData = new FormData();
      formData.append("name", appName);
      formData.append("appFile", file);

      const username = "garvita.ngpl";
      const password = "0XtbDyo6bzLcttpL2SzBYacp5L9JQ9F4nEH35j47q5eNTibzAU";

      // Upload file
      setCurrentStage(1);
      const uploadResponse = await fetch(
        "https://manual-api.lambdatest.com/app/upload/realDevice",
        {
          method: "POST",
          body: formData,
          headers: new Headers({
            Authorization: "Basic " + btoa(username + ":" + password),
          }),
        }
      );

      const uploadData = await uploadResponse.json();

      // Initiate test
      setCurrentStage(2);
      const testResponse = await fetch("https://54.160.51.220:2424/app/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appUrl: uploadData.app_url }),
        agent: new (require('https').Agent)({
          rejectUnauthorized: false,
        }),
      });

      const testData = await testResponse.json();
      // Extract the UUID string from the response data
      const inputString = testData.data

      const uuidArray = inputString.slice(1, -1).split(', ');

      // Convert each UUID to a string
      const stringUuidArray = uuidArray.map(uuid => String(uuid));

      // Get sessions using the session ID from testData
      setCurrentStage(3);

      const fetchPromises = stringUuidArray.map(async (sessionId) => {
        const sessionsResponse = await fetch(
          `https://mobile-api.lambdatest.com/mobile-automation/api/v1/sessions/${sessionId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization:  "Basic Z2Fydml0YS5uZ3BsOjBYdGJEeW82YnpMY3R0cEwyU3pCWWFjcDVMOUpROUY0bkVIMzVqNDdxNWVOVGliekFV", // Replace with your actual Authorization header value
            },
          }
        );
        if (sessionsResponse.ok) {
          const sessionData = await sessionsResponse.json();
          return sessionData.data; 
        } else {
          throw new Error(`Failed to fetch session data for ID ${sessionId}`);
        }
      });
        const sessionsDataArray = await Promise.all(fetchPromises);
        setData(sessionsDataArray);
      const dataExist = await fetchTests();
      if (dataExist.length > 0) {
        handleUpdateSession(sessionsDataArray);
      } else {
        handleCreateSession(sessionsDataArray);
      }
      setLoading(false);
      fetchTests();
      setCurrentStage(0);
      handleClear();
      onComplete(sessionsDataArray);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleCreateSession = async (session) => {
    try {
      console.log("ID", auth.user.id);
      const response = await createSessionData({
        user_id: auth.user.id,
        session: session,
      });
    } catch (error) {
      console.log("Error while creating new project: " + error);
    }
  };

  const handleUpdateSession = async (session) => {
    try {
      console.log("ID", auth.user.id);
      const response = await updateUserSession({
        user_id: auth.user.id,
        session: session,
      });
    } catch (error) {
      console.log("Error while creating new project: " + error);
    }
  };

  const fetchTests = async () => {
    try {
      const response = await getAllSessions(auth.user.id);
      if(response.length > 1){
        setData([response[0].session]);
      }
      return response

      // setTestCases(response.tests);
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      // setTestCases([]);
    }
  };

  return (
    <Container component="main">
      <Typography component="h1" variant="h5" pb={3}>
        Upload APK
      </Typography>
      <Paper
        elevation={3}
        style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} hidden />
        <Box
          mt={2}
          border="2px solid #ccc"
          borderColor="primary"
          onClick={handleClick}
          height={"250px"}
          width={"100%"}
          borderRadius={2}
          sx={{
            cursor: "pointer",
            "&:hover": {
              borderColor: "secondary",
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <CloudUploadOutlined fontSize="large" color="primary" />
            <Typography variant="body1" textTransform={"none"} fontWeight={"bold"} color="primary">
              {file?.name ? file?.name : "Browse APK file to upload"}
            </Typography>
          </Box>
        </Box>
        <LoadingButton
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="start"
          disabled={!file}
          startIcon={<FileUploadOutlined />}
          onClick={handleUpload}
          sx={{ mt: 2 }}
        >
          <span>{TestPhrases[currentStage]?.title}</span>
        </LoadingButton>
      </Paper>
    </Container>
  );
};

export default ApkUploadPage;
