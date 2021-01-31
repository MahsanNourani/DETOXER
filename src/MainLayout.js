import React, { useRef, useEffect } from "react";

// Note to self: CLSX is a dynmaic conditional class joining framework.
import clsx from "clsx";

import {
  Drawer as MUIDrawer,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import { makeStyles } from "@material-ui/core/styles";
import DrawerContent from "./DrawerContent";
import VideoPlayer from "./VideoPlayer";
// import Dialoge from './Dialoge';

// These components are loaded for the draggable dilaoge box for the global information.

import { createInputLog, createBoolLog, getLogJson } from "./Logger";

import Notebook from "./Notebook";
import GlobalInfoCard from "./GlobalInfoCard";

//React.Fragment --> similar to div but for when you cannot have items within a div as they'll lose their functionality!
// Use Fragment simialar to d3.group??

// Make sure to change the drawer width based on the size of the final drawer.
// Note the number is not a string or in pixels. The shifting won't work strings. The browser automatically translates this into pixels. (why?)
const drawerWidth = 410;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.primary.dark,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  open: {
    transform: "scaleX(1)",
  },
  close: {
    transform: "scaleX(-1)",
  },
  flip: {
    transform: "scale(-1,-1)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
  navbarButton: {
    color: theme.palette.primary.contrastText,
  },
  navbarButtons: {
    marginLeft: "auto",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    padding: "10px",
  },
  // With this below, the size will be set to the drawerWidth. Without it, it will fit the content.
  drawerPaper: {
    width: drawerWidth,
    padding: 0,
    maxHeight: "100vh",
    overflowY: "hidden",
    borderTop: 0,
    backgroundColor: "#f4f8ff",
  },

  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(3, 0) / 2,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  toolbar: {
    height: "40px",
    minHeight: "40px",
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    paddingTop: "48px", // 48px is the height of the appbar
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    // backgroundColor: "#f4f8ff",
    height: "100vp",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  userTaskButton: {
    marginLeft: "auto",
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardStyle: {
    minWidth: 400,
    cursor: "move",
  },
  notebookCardStyle: {
    minWidth: 400,
    cursor: "move",
    backgroundColor: theme.palette.secondary.notebook,
  },
  hidden: {
    display: "none",
  },
  fontSizeLarge: {
    fontSize: 30,
  },
  listIcon: {
    color: theme.palette.secondary.dark,
  },
  listPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listIconRoot: {
    fontSize: "0.75rem",
  },
  listItemRoot: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  chartTitle: {},
  highlight: {
    color: theme.palette.secondary.main,
    fontWeight: "bold",
  },
  cardActionsRoot: {
    padding: 0,
  },
  cardContentRoot: {
    paddingTop: 0,
    paddingBottom: "0!important",
  },
  notebookCardContent: {
    paddingTop: 0,
  },
  closeIconRoot: {
    marginLeft: "auto",
  },
  notebook: {
    fontSize: "14px",
    color: "black",
  },
}));

export default function MainLayout() {
  const classes = useStyles();

  const condition = parseInt(localStorage.getItem("cond"));

  const drawerToggle = () => {
    setOpen(!open);
  };
  const dialogeOpen = () => {
    setDialogeOpen(true);
  };
  const dialogeClose = () => {
    setDialogeOpen(false);
  };

  const globalDialogeToggle = () => {
    setGlobalInfoOpen(!openGlobalInfo);
    createBoolLog("glob_inf", !openGlobalInfo ? "opened" : "closed");
  };
  const globalDialogeClose = () => {
    setGlobalInfoOpen(false);
    createBoolLog("glob_inf", "closed");
  };

  const notebookToggle = () => {
    setNotebookOpen(!openNotebook);
    createBoolLog("note", !openNotebook ? "opened" : "closed");
  };
  const notebookClose = () => {
    setNotebookOpen(false);
    createBoolLog("note", "closed");
  };

  const [currentVidData, setVidData] = React.useState("probs.s13-d21.mp4.csv");
  const [currentVidSrc, setVidSrc] = React.useState(
    "https://indie.cise.ufl.edu/Pineapple/assets/videos/s13-d21.mp4"
  );

  // Callback function passed to the children (final stop, the button on the side panel to inspect video) and passed to onClick.
  const setVideoAndData = (videoName) => {
    const videoSrc =
      "https://indie.cise.ufl.edu/Pineapple/assets/videos/" +
      videoName +
      ".mp4";
    const videoData = "probs." + videoName + ".mp4.csv";

    setVidSrc(videoSrc);
    setVidData(videoData);

    createInputLog("vid_ld", videoName);
  };

  const player = useRef(null);

  const [open, setOpen] = React.useState(true);
  const [openDialoge, setDialogeOpen] = React.useState(false); //user Study task

  const [openGlobalInfo, setGlobalInfoOpen] = React.useState(true); //used to toggle open/close for the global info dialoge box
  const [openNotebook, setNotebookOpen] = React.useState(true); // used to toggle open/close the notebook (user study!)
  const [submitEnabled, setSubmit] = React.useState(false); //Submit button is disabled.

  useEffect(() => {
    const timer = setTimeout(() => {
      // enable the submit button to download the results after 20 minutes
      setSubmit(true);
    }, 1200000);
    return () => clearTimeout(timer);
  }, []);

  function submit() {
    // This function creates and downloads the logs as a json file
    let filename = "sub-" + localStorage.getItem("userID") + ".json";
    let contentType = "application/json;charset=utf-8;";
    let objectData = getLogJson();

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(objectData)))],
        { type: contentType }
      );
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.download = filename;
      a.href =
        "data:" +
        contentType +
        "," +
        encodeURIComponent(JSON.stringify(objectData));
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar variant="dense" classes={{ root: classes.toolbar }}>
          <IconButton
            aria-label="open drawer"
            onClick={drawerToggle}
            className={classes.menuButton}
          >
            <QueuePlayNextIcon
              className={clsx(!open && classes.open, open && classes.close)}
            />
          </IconButton>
          <Typography variant="h6" noWrap>
            Activity Detection Tool
          </Typography>
          <div className={classes.navbarButtons}>
            <Button
              aria-label="open global info"
              className={clsx({
                [classes.navbarButton]: true,
                [classes.hidden]: !condition,
              })}
              startIcon={<LaunchIcon className={classes.flip} />}
              onClick={globalDialogeToggle}
            >
              Global Information
            </Button>
            <Button
              aria-label="open notepad"
              className={classes.navbarButton}
              startIcon={<MenuBookIcon />}
              onClick={notebookToggle}
            >
              Notepad
            </Button>
            <Button
              aria-label="submit"
              className={classes.navbarButton}
              startIcon={<AssignmentTurnedInIcon />}
              onClick={submit}
              disabled={!submitEnabled}
            >
              Submit
            </Button>
          </div>
          {/* <Button aria-label="open dialoge" onClick={dialogeOpen} startIcon={<AssignmentIcon />} 
							color="secondary" variant="contained" className={classes.userTaskButton}>
						User Study Task
					</Button> */}
        </Toolbar>
      </AppBar>
      <MUIDrawer
        variant="persistent"
        open={open}
        anchor="left"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <DrawerContent onVideoClick={setVideoAndData} />
      </MUIDrawer>
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        <div className={classes.drawerHeader}>
          <Grid container spacing={1}>
            <Grid item md={7}>
              <VideoPlayer
                ref={player}
                source={currentVidSrc}
                data={currentVidData}
              />
            </Grid>
            <Grid container item md={4} spacing={1}>
              <Grid
                item
                md={12}
                className={clsx({ [classes.hidden]: !condition })}
              >
                <GlobalInfoCard
                  open={openGlobalInfo}
                  close={globalDialogeClose}
                />
              </Grid>
              <Grid item md={12}>
                <Notebook open={openNotebook} close={notebookClose} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </main>
      {/* <Dialoge open={openDialoge} handleClose={dialogeClose}/> */}
    </div>
  );
}
