import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import updateCompanyName from '../api/v1/updateCompanyName';
const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      companyName: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      companyName: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        const registered_user = await auth.signUp(values.email, values.name, values.password);
        console.log("🚀 ~ file: register.js:38 ~ onSubmit: ~ registered_user:", registered_user)
        if(registered_user?.user?.user_metadata){
          const user_id = registered_user?.user?.user_metadata.sub ? registered_user?.user?.user_metadata.sub : registered_user?.user?.id;
          updateCompanyName(user_id, values.companyName)
        }
        // router.push("/auth/login")
        setEmailSent(true)
        
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        setEmailSent(false);
        setIsLoading(false)
      }
    }
  });
  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/')
    }
  }, []);
  return (
    <>
      <Head>
        <title>
          Register | Devias Kit
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {emailSent === false ?<Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.companyName && formik.errors.companyName)}
                  fullWidth
                  helperText={formik.touched.companyName && formik.errors.companyName}
                  label="CompanyName"
                  name="companyName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled = {isLoading}
              >
                {isLoading? <CircularProgress color="primary"/>: "Continue"}
              </Button>
            </form>
          </div>
        </Box>:
        <Box>
          <Typography sx = {{color: "gray", fontWeight: "bold", textAlign: "center"}}>
          Congratulations.🎉 
        </Typography>
        <Typography sx = {{color: "gray", fontWeight: "bold"}}>
          We Have Sent An Email To You. Please Verify And ComeBack.✈️ 
        </Typography>
        </Box>
        }
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
