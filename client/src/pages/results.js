import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { TestInformation } from 'src/sections/createTests/testInformation';
import ApkUploadPage from 'src/sections/ApkUploadPage/ApkUploadPage';
import Results from 'src/sections/ApkUploadPage/results';

const Page = () => {
  return (
    <>
      <Head>
        <title>
          Results | Darknore
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container >
          <Stack spacing={3}>
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Results/>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
};


Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
