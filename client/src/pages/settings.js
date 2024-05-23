import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Stack, Typography, Grid, Link, Button } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

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
  const classes = useStyles();
  const router = useRouter();
  console.log("🚀 ~ router:", router)

  const links = [
    { href: '/createTests', label: 'Create Test' },
    { href: '/testSuites', label: 'Test Suites' },
    { href: '/testReports', label: 'Test Reports' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <>
      <Head>
        <title>Settings | Devias Kit</title>
      </Head>
      <Grid container spacing={2} py={4} style={{ height: '100%' }}>
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <Typography variant="h4">Settings</Typography>
              <SettingsPassword />
            </Stack>
          </Container>
        </Box>
      </Grid>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
