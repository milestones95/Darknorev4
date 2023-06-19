import { useCallback, useState } from 'react';
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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

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
                    name="User Story Name"
                    required

                  />
                </Grid>
                <Grid
                  xs={8}
                >
                  <TextField
                    fullWidth
                    label="Protocol"
                    name="Protocol"
                    placeholder="https://"
                    required
                    select
                  />
                </Grid>
                <Grid
                  xs={8}
                >
                  <TextField
                    fullWidth
                    label="Base URL"
                    name="Base URL"
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
                  name="User Story Description"
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
                    label="Acceptance Criteria Optional"
                    name="Acceptance Criteria Optional"
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
          <Button variant="contained">
            Next
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
