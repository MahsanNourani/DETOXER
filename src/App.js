import React from 'react';
import './App.css';
import {Container, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Mainlayout from './MainLayout';

const useStyles = makeStyles ( theme => ({
  containerStyle: {
    backgroundColor: "#efebe9",
    height: '100vh'
  },
  mainGrid: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  }
}));

function App() {
  const classes = useStyles();
  return (
      <Mainlayout />
      // <Container maxWidth="md" className={classes.containerStyle}>
      //   <Grid container spacing={2} justify="center">
      //     <Grid item sm={12} container justify="center" spacing={3}>
      //       <Grid item sm={12}/>
      //       <Grid item sm={6} className={classes.mainGrid}>
      //         <Typography variant="h4" align="center"> Global Information</Typography>
      //       </Grid>
      //     </Grid>
      //     <Grid item sm={6} container justify="center">
      //       <Grid item sm={12} container justify="center" className={classes.mainGrid}>
      //         <Grid item sm={8}>
      //           <Typography variant="h5">The system accuracy is:</Typography>
      //         </Grid>
      //         <Grid item sm={4}>
      //           <Typography variant="h5">85%.</Typography>
      //         </Grid>
      //       </Grid>
      //     </Grid>
      //   </Grid>
      // </Container>
  );
}

export default App;
