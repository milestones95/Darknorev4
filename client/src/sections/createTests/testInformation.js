import { useCallback, useState, useContext, useEffect } from 'react';
// import { useRouter } from 'next/router';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { TestCreationData } from 'src/contexts/test-creation-context';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const TestInformation = () => {
  const {addUserStory } = useContext(TestCreationData);
  const [showAlert, setShowAlert] = useState(false);

  // const router = useRouter();

  const handleSubmit = async (event) => {
      event.preventDefault();

      console.log("generate clicked");

      // Get the form field values
      const name = event.target.elements.userStoryName.value;
      const url = event.target.elements.baseUrl.value;
      const userStoryDetails = event.target.elements.userStoryDescription.value;
      const ac = event.target.elements.acceptanceCriteria.value;

      if (event.target.elements.userStoryName.value.trim() === '' &&
          event.target.elements.baseUrl.value.trim() === '' &&
          event.target.elements.userStoryDescription.value.trim() === '' &&
          event.target.elements.acceptanceCriteria.value.trim() === '') {
            setShowAlert(true)
            return;
      }


      addUserStory(name, url, userStoryDetails, ac)


        // // Send the API request
        // const urlsParsed = await fetch("http://localhost:8000/api/scrape-urls", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({url: "https://www.darknore.com"}),
        // });
        //
        // const parsedUrls = await urlsParsed.json();
        // console.log("response data: " + JSON.stringify(parsedUrls));


      // Create the request body
      const requestBody = {
        userStory: userStoryDetails,
        acceptanceCriteria: ac,
      };

      // Send the API request
      const response = await fetch("http://localhost:5000/api/createTestScenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // if (response.ok) {
      //   const responseData = await response.json();
      //   router.push({
      //     pathname: '/testScenarioPage',
      //     query: { response: JSON.stringify(responseData) },
      //   });
      // } else {
      //   // Handle the error case
      //   console.log('API request failed');
      // }

    };

    const handleAlertClose = () => {
      setShowAlert(false);
    };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information below will be used to generate your plain english test scenarios."
          title="Test Information"
        />
        <CardContent sx={{ pt: 0 }}>
        {showAlert && (
            <Alert severity="error" onClose={handleAlertClose}>
              Please fill in all of the text fields.
            </Alert>
          )}
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
            >
            <Grid
              xs={6}
            >
                  <Grid
                    xs={8}
                  >
                    <TextField
                      fullWidth
                      label="User Story Name"
                      name="userStoryName"
                      required
                    />
                  </Grid>
                  <Grid
                    xs={8}
                  >
                    <TextField
                      fullWidth
                      label="Base Url"
                      name="baseUrl"
                      required
                      placeholder="https://"
                    />
                  </Grid>
                </Grid>
              <Grid
                xs={6}
              >
                <Grid
                  xs={12}
                >
                <TextField
                  fullWidth
                  fullHeight
                  label="User Story Description"
                  name="userStoryDescription"
                  multiline
                  rows={4}
                  required
                >
                </TextField>
                </Grid>
                <Grid
                  xs={12}
                >
                  <TextField
                    fullWidth
                    fullHeight
                    label="Acceptance Criteria"
                    name="acceptanceCriteria"
                    multiline
                    rows={4}
                    required
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Generate Scenarios
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
