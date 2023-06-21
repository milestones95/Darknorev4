import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export const SelectScenario = () => (
    <TextField
      defaultValue=""
      fullWidth
      select
      label="Select Scenario type "

      sx={{ maxWidth: 500 }}
    >
    <MenuItem key="All" value="All">
          All
    </MenuItem>
      <MenuItem key="Happy Path" value="Happy Path">
            Happy Path
      </MenuItem>
      <MenuItem key="Non-Happy Path" value="Non-Happy Path">
            Non-Happy Path
      </MenuItem>
    </TextField>
);
