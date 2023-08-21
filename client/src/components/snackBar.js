import * as React from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';
// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });

const SnackBar = (props) => {

    const [open, setOpen] = useState(true);
    const [progress, setProgress] = React.useState(100);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => prevProgress - 2.5);
          }, 90);
          
          const duration = setTimeout(() => {
            clearInterval(interval);
            setOpen(false);
            props.setSnackBar(null);
            setProgress(0);
          }, 4000);
        
          return () => {
            clearTimeout(duration);
          }
         
    }, []);
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };
    return (
        <>
       <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
         <Box>
         <Alert onClose={handleClose} severity= {props.severity} variant="filled" sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {props.message}
         </Alert>
         <LinearProgress
          variant="determinate" 
          value={progress} 
          sx = {{backgroundColor: '#67b364', '& .MuiLinearProgress-bar': { backgroundColor: 'green'}}} 
        />
         </Box>
       </Snackbar>
        </>
    )
}
export default SnackBar;