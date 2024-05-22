import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import { supabase } from 'src/pages/api/SupabaseClient';
import { toast } from "react-toastify";

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: '',
    confirm: ''
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
    async (event) => {
      event.preventDefault();
      if (values.password === values.confirm) {
        try {
          // const user = supabase.auth.user();
          // console.log("🚀 ~ user:", user)
          // if (user) {
            await supabase.auth.updateUser({ password: values.password })
            console.log('Password updated successfully!');
            toast.success("Password updated successfully!");
          // } else {
          //   console.error('User is not authenticated.');
          // }
        } catch (error) {
          console.error('Error updating password:', error.message);
          toast.error("Error updating password!");
        }
      } else {
        console.error('Passwords do not match.'); 
        toast.error("Passwords do not match!");
      }
    },
    [values]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
