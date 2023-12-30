import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const items = [
  {
    title: 'Projects',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <VisibilityIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Upload Apk',
    path: '/createTests',
    icon: (
      <SvgIcon fontSize="small">
        <AddCircleOutlineIcon />
      </SvgIcon>
    )
  }
];
