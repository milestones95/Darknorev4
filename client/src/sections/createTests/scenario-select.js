import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

export const SelectScenario = (props) => (
      <TextField
      defaultValue="All"
      fullWidth
      select
      label="Select Scenario type "
      onChange={event => props.setDisplayedScenarios(event.target.value)}
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

SelectScenario.propTypes = {
   setDisplayedScenarios: PropTypes.string.isRequired,
};
