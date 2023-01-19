import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
import { Box, Grid } from '@mui/material';


function Skelton() {
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {/* {Array.from(Array(6)).map((_, index) => ( */}
          <Grid item xs={2} sm={4} md={6} >
             <Skeleton variant="rectangular"  height={318} />
          </Grid>
          <Grid item xs={2} sm={4} md={1} >
             {/* <Skeleton variant="rectangular"  height={318} /> */}
          </Grid>
          <Grid item xs={2} sm={4} md={5} >
             <Skeleton variant="rectangular"  height={318} />
          </Grid>
      </Grid>
    </Box>
    <Stack spacing={1} sx={{ pt: 4 }}>
    <Skeleton variant="h1" sx={{ fontSize: '3rem' }} ></Skeleton>
      {Array.from(Array(10)).map((_, index) => (
        <Skeleton variant="h1"  sx={{ fontSize: '2rem' }} ></Skeleton>
      ))
      }
    </Stack>
</>
  );
}
export default Skelton