import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  const router = useRouter();

  const [values, setValues] = useState({
    firstName: 'Anika',
    lastName: 'Visser',
    email: 'demo@devias.io',
    phone: '',
    state: 'los-angeles',
    country: 'USA'
  });


  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    
      console.log("generate clicked");

      // Get the form field values
      const name = event.target.elements.userStoryName.value;
      const url = event.target.elements.baseUrl.value;
      const userStoryDetails = event.target.elements.userStoryDescription.value;
      const ac = event.target.elements.acceptanceCriteria.value;


        // Send the API request
        const urlsParsed = await fetch("http://localhost:8000/api/scrape-urls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({url: "https://www.darknore.com"}),
        });

        const parsedUrls = await urlsParsed.json();
        console.log("response data: " + JSON.stringify(parsedUrls));
        
    
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

      if (response.ok) {
        const responseData = await response.json();
        router.push({
          pathname: '/testScenarioPage',
          query: { response: JSON.stringify(responseData) },
        });
      } else {
        // Handle the error case
        console.log('API request failed');
      }
    };

    // const history = useHistory();


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
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
            >
            <Grid
              xs={7}
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
                    label="Base URL"
                    name="baseUrl"
                    required
                    placeholder="https://"
                  />
                </Grid>
              </Grid>
              <Grid
                xs={5}
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
