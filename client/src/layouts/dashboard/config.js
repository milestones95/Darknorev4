import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'View Tests',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Login',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Test Steps Page',
    path: '/testStepsPage',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Test Scenario Page',
    path: '/testScenarioPage',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'CreateTests',
    path: '/createTests',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  }
];
