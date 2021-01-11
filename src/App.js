import React from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Mainlayout from "./MainLayout";
import { initiateLogState } from "./Logger";

const useStyles = makeStyles((theme) => ({
  containerStyle: {
    backgroundColor: "#efebe9",
    height: "100vh",
  },
  mainGrid: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

function App() {
  const classes = useStyles();

  initiateLogState();

  return (
    <React.Fragment>
      <Mainlayout />
    </React.Fragment>
  );
}

export default App;
