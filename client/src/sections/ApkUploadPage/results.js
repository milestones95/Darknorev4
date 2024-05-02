// ApkUploadPage.js
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
const Results = () => {
  const [logData, setLogData] = useState(null);
  const router = useRouter();

  const data = JSON.parse(router.query.data);

  const videoUrl =
    "https://prod-mobile-artefacts.lambdatest.com/orgId-1149215/APPTESjPTQUBPbu96qghvv/video/video.mp4";

  const screenshots = [
    "assets/screenshots/ss2.png",
    "assets/screenshots/ss1.png",
    "assets/screenshots/ss3.png",
    // Add more screenshot URLs as needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      const session = data?.session_id;
      try {
        if (data?.session_id) {
          const response = await fetch(
            `https://mobile-api.lambdatest.com/mobile-automation/api/v1/sessions/${session}/log/appium`,
            {
              method: "GET",
              headers: {
                accept: "text/plain",
                Authorization:
                  "Basic Z2Fydml0YS5uZ3BsOjBYdGJEeW82YnpMY3R0cEwyU3pCWWFjcDVMOUpROUY0bkVIMzVqNDdxNWVOVGliekFV",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.text();
          setLogData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [data]);

  return (
    <Container component="main" maxWidth="xl">
      <Grid container style={{ paddingTop: "20px" }}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom style={{ marginBottom: "40px" }}>
            Results
          </Typography>
        </Grid>

        <Grid container spacing={3}>
          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ textDecoration: "underline", color: "grey" }}
            >
              Details
            </Typography>
            <Paper
              elevation={3}
              style={{
                padding: "20px",
                marginTop: "20px",
                height: "92%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
              }}
            >
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>Name:</strong> {data?.name}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>Platform:</strong> {data?.platform}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>OS Version:</strong> {data?.os_version}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>Device Name:</strong> {data?.device_name}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>Build Name:</strong> {data?.build_name}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>SessionId:</strong> {data?.session_id}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                <strong>Creation Time:</strong> {data?.create_timestamp}
              </Typography>
            </Paper>
          </Grid>

          {/* Video Section */}
          {data?.video_url && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                gutterBottom
                style={{ textDecoration: "underline", color: "grey" }}
              >
                Video
              </Typography>
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  marginTop: "20px",
                  position: "relative",
                  overflow: "hidden",
                  paddingBottom: "100%",
                }}
              >
                {console.log(data?.video_url)}
                <video
                  controls
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                  }}
                >
                  <source src={data?.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Screenshots:
          </Typography>
          <Grid container spacing={2}>
            {screenshots.map((screenshot, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <img
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  style={{ width: "100%", height: "auto", marginBottom: "10px" }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid item xs={12}>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              textDecoration: "underline",
              marginTop: "20px",
              marginBottom: "10px",
              color: "grey",
            }}
          >
            Test Logs
          </Typography>
          <Paper
            elevation={3}
            style={{
              width: "100%",
              height: 400,
              border: "2px solid #ccc",
              overflowY: "scroll",
              padding: 10,
              backgroundColor: "black",
              color: "white",
            }}
          >
            <Typography variant="body2" className="log">
              {logData}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Results;
