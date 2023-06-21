import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TestSteps } from 'src/sections/createTests/testSteps';
import { TestsSearch } from 'src/sections/viewTests/tests-search';
import { applyPagination } from 'src/utils/apply-pagination';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const now = new Date();

const data = [
  {}, {}
];

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {
  const [testSteps, setTestSteps] = useState([{}, {}]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);


  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  function handleAddNewTestStep() {
    const newTestSteps = testSteps.concat({});
    setTestSteps(newTestSteps)
  }

  return (
    <>
      <Head>
        <title>
          Customers | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Tests Steps
                </Typography>
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
                <Typography sx={{ mb: 2 }}>
                  Scenario 1 - User enters a valid name and email address and submits the form successfully.
                </Typography>
              <TestSteps
                count={testSteps.length}
                items={testSteps}
                onDeselectAll={customersSelection.handleDeselectAll}
                onDeselectOne={customersSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={customersSelection.handleSelectAll}
                onSelectOne={customersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={customersSelection.selected}
              />
              <Grid xs={12}>
                  <Grid xs={12}>
                    <Button variant="text" onClick={handleAddNewTestStep}>
                    <Typography>
                      Add New Test Step
                    </Typography>
                    <AddCircleIcon sx={{ ml: 1 }}/>
                    </Button>
                  </Grid>
              </Grid>
            </Card>
          </Stack>
          <div align="center">
            <Button variant="contained" size="small" align="center" sx={{mt: 2}}>
              Add Test Steps
            </Button>
          </div>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;