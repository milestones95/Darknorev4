import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Container
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import React, { useState, useEffect } from 'react';
import NewTestWizard  from '/src/sections/layouts/new-test-wizard';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowIcon from "@mui/icons-material/ArrowRightOutlined"

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/navigation';
export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const [showBreadCrumb, setShowBreadCrumb] = useState(false);
  const [showTestWizard, setShowTestWizard] = useState(false);
  const auth = useAuth();

  // Determine if the button should be displayed based on the current page
  const shouldShowTestWizard = () => {
    const allowedPages = [
                          '/createTests',
                          '/testScenarioPage',
                          '/testStepsPage',
                          '/viewTests',
                          '/createProject'
                        ]; // Add the paths of the pages where the button should appear

    return allowedPages.some((path) => window.location.pathname.startsWith(path));
  };

  useEffect(() => {
    setShowBreadCrumb(shouldShowTestWizard());
    if (window.location.pathname === "/") {
      setShowBreadCrumb(true);
      setShowTestWizard(false);
    }
    if (window.location.pathname === "/createTests" && window.location.search.includes("userStoryId") === false) {
      setShowTestWizard(true);
    } else if (window.location.pathname === "/testScenarioPage" || window.location.pathname === "/createProject") {
      setShowTestWizard(true);
    } else {
      setShowTestWizard(false);
    }
  }, [window.location.pathname]);

  const getBreadCrumb = () => {
    if (window.location.pathname === "/" && window.location.search === "") {
      return (
        <Typography color="#555" variant='h5'>
          My Dashboard
        </Typography>
      )
    } else if (window.location.pathname === "/" && window.location.search.includes("projectName")) {
      return (
        <Container style={{display: "flex", flexDirection: "row", padding: 0}}>
          <Link underline="hover" color="#06aed4" href="/" variant='h5'>
            Home
          </Link>
          <SvgIcon fontSize='large' color='#555'>
            <ArrowIcon />
          </SvgIcon>
          <Typography underline="hover" color="#555" href="/" variant='h5'>
            {getProjectName()}
          </Typography>
        </Container>
      )
    } else if (window.location.pathname === "/createTests" && window.location.search.includes("userStoryId")) {
      return (
        <Container style={{display: "flex", flexDirection: "row", padding: 0}}>
          <Link underline="hover" color="#06aed4" href="/" variant='h5'>
            Home
          </Link>
          <SvgIcon fontSize='large' color='#555'>
            <ArrowIcon />
          </SvgIcon>
          <Link underline="hover" color="#06aed4" href={`/?projectId=${getProjectId()}&projectName=${getProjectName()}`} variant='h5'>
            {getProjectName()}
          </Link>
        </Container>
      )
    } else if (window.location.pathname === "/viewTests" && window.location.search.includes("userStoryId")) {
      return (
        <Container style={{display: "flex", flexDirection: "row", padding: 0}}>
          <Link underline="hover" color="#06aed4" href="/" variant='h5'>
            Home
          </Link>
          <SvgIcon fontSize='large' color='#555'>
            <ArrowIcon />
          </SvgIcon>
          <Link underline="hover" color="#06aed4" href={`/?projectId=${getProjectId()}&projectName=${getProjectName()}`} variant='h5'>
            {getProjectName()}
          </Link>
        </Container>
      )
    } else if (window.location.pathname === "/createTests" && (window.location.search === "" || window.location.search.includes("projectId"))) {
      return (
        <Typography color="#555" variant='h5'>
          Create User Story
        </Typography>
      )
    } else if (window.location.pathname === "/testScenarioPage") {
      return (
        <Typography color="#555" variant='h5'>
          Generate Scenarios
        </Typography>
      )
    } else if (window.location.pathname === "/createProject") {
      return (
        <Typography color="#555" variant='h5'>
          Select Project
        </Typography>
      )
    }
  }

  const getProjectId = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectId");
  }

  const getProjectName = () => {
    const searchTerms = new URLSearchParams(window.location.search);
    return searchTerms.get("projectName");
  }
  const router = useRouter();
  const handleLogOut = async () => {
    console.log("handle LogOut pressed!")
    await auth.signOut();
    router.push('/auth/login')
  }
  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          {showBreadCrumb && (
            <Grid container>
              <Grid md={showTestWizard ? 3.5 : 6}>
                <Breadcrumbs
                 aria-label="breadcrumb">
                  {getBreadCrumb()}
                </Breadcrumbs>
              </Grid>
              {showTestWizard && <Grid md={showTestWizard ? 7.5 : 6}>
                <NewTestWizard />
              </Grid>}
            </Grid>
          )}
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Tooltip title="Contacts">
              <IconButton>

              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton>
              </IconButton>
            </Tooltip>
            <Tooltip title="LogOut">
              <IconButton onClick={handleLogOut} sx={{gap: .5, "&:hover": { backgroundColor: "#FFEECC" }}}>
              <LogoutIcon/>
              <Typography variant = "button">LogOut</Typography>
              </IconButton>
            </Tooltip>

          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
