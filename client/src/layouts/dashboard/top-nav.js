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
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import React, { useState, useEffect } from 'react';
import NewTestWizard  from 'src/sections/layouts/new-test-wizard';
import Grid from '@mui/material/Grid';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const [showTestWizard, setTestWizard] = useState(false);

  // Determine if the button should be displayed based on the current page
  const shouldShowTestWizard = () => {
    const allowedPages = [
                          '/createTests',
                          '/testScenarioPage',
                          '/testStepsPage'
                        ]; // Add the paths of the pages where the button should appear

    return allowedPages.some((path) => window.location.pathname.startsWith(path));
  };

  useEffect(() => {
    setTestWizard(shouldShowTestWizard());
  }, [window.location.pathname]);


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
          {showTestWizard && (
            <Grid container>
              <Grid md={2}>
                <Typography variant="h5">
                  New Test
                </Typography>
              </Grid>
              <Grid md={10}>
                <NewTestWizard />
              </Grid>
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
