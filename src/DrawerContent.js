import React, { useEffect } from "react";
import {
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  AccordionDetails,
  Divider,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import clsx from "clsx";
// import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
// import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
// import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import BarChart from "./BarChart";
// import {cyan, yellow, lightBlue} from '@material-ui/core/colors';
import VideoPreview from "./VideoPreview";
// import { green, red } from '@material-ui/core/colors';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// import clsx from 'clsx';
import drawerContentCooking from "./data/dset.json";
import drawerContentWetlab from "./data/dset-wetlab.json";

const useStyles = makeStyles((theme) => ({
  // listIcon: {
  // 	color: theme.palette.secondary.dark,
  // },
  // listPadding: {
  // 	paddingTop: 0,
  // 	paddingBottom: 0,
  // },
  // listIconRoot: {
  // 	fontSize: "3rem",
  // },
  // listItemRoot: {
  // 	paddingTop: 2,
  // 	paddingBottom: 2,
  // },
  AccordionDetailsRoot: {
    display: "block",
    padding: theme.spacing(0.5),
  },
  dividerBottom: {
    marginBottom: 10,
    marginTop: 5,
    // marginTop: 20,
  },
  chartTitle: {
    marginBottom: theme.spacing(1),
  },
  dividerTop: {
    marginTop: 10,
    marginBottom: 5,
  },
  drawerTitle: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    // border: "1px solid #e0e0e0",
    // borderRadius: "3px",
    padding: theme.spacing(1) / 2,
    marginBottom: theme.spacing(1) / 2,
  },
  sticky: {
    position: "-webkit-sticky",
    position: "sticky",
    top: 0,
    bottom: 10,
    zIndex: 5,
    // backgroundColor: "white",
  },
  mainDiv: {
    overflowY: "scroll",
    overflow: "auto",
  },
  videoAccordion: {
    // maxHeight: '620px',
    // overflowY: 'scroll',
    paddingTop: theme.spacing(1),
  },
  // fontSizeLarge: {
  // 	fontSize:30,
  // }
}));

const Accordion = withStyles((theme) => ({
  root: {
    border: 0,
    borderTop: "1px solid rgba(0, 0, 0, .125)!important",
    // borderBottom: 'none',
    // borderTop: 'none',
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    //   backgroundColor: 'rgba(0, 0, 0, .03)',
    //   borderBottom: '1px solid rgba(0, 0, 0, .125)',
    backgroundColor: theme.palette.primary.dark, //#3F51B5
    color: "white",
    marginBottom: -1,
    minHeight: 35,
    "&$expanded": {
      minHeight: 37,
    },
  },
  content: {
    fontWeight: "900!important",
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expandIcon: {
    color: "white",
  },
  expanded: {},
}))(MuiAccordionSummary);

// const highPrecision = cyan[400];
// const lowPrecision  = yellow[600];

export default function DrawerContent(props) {
  const classes = useStyles();
  // TODO for later: I need to read this info from the dataset.

  // const globalInfo = drawerContent.globalInfo;

  // const [items, setItems] = React.useState([
  // 	{ text: "Model Accuracy", value: globalInfo.accuracy, icon: <SettingsApplicationsIcon fontSize="large" style={{color:lightBlue.A700}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
  // 	{ text: "Estimation of False Positives", value: globalInfo.falsePositiveRate, icon: <AddBoxRoundedIcon fontSize="large" style={{color:green.A700}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
  // 	{ text: "Estimation of False Negatives", value: globalInfo.falseNegativeRate, icon: <IndeterminateCheckBoxIcon fontSize="large" style={{color:red[500]}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
  // ]);
  // const listItems = items.map((item, index) => {
  // 	return (
  // 		<ListItem key={index} classes={{root: classes.listItemRoot}}>
  // 			<ListItemIcon classes={{root: classes.listIconRoot}}>
  // 				{item.icon}
  // 			</ListItemIcon>
  // 			<ListItemText primary={item.text} />
  // 			<ListItemIcon color="secondary">
  // 				{`${item.value}%`}
  // 			</ListItemIcon>
  // 		</ListItem>
  // 	)
  // });

  // const highPrecisionData = globalInfo.objectPrecisionScores;
  // const lowPrecisionData = globalInfo.lowestPrecisionObjects;

  const [currentVideo, setCurrentVideo] = React.useState(0);
  // const videoRefs = {};

  // the video name and the thumbnail name should be the same! Each video will only have one thumbnail.
  let videoPreview = [];
  if (props.dataset == "cooking") videoPreview = drawerContentCooking.videoInfo;
  else {
    videoPreview = drawerContentWetlab.videoInfo;
  }
  // const videoPreview = videoPreviewTemp.map(item => ({ item, ref: React.createRef() }));
  // console.log(videoPreview);
  // console.log(props.dataset);

  const onVideoClick = (videoName, index) => {
    props.onVideoClick(videoName);
    setCurrentVideo(index);
  };

  const videoPreviewList = videoPreview.map((item, i) => {
    // const thisRef = React.createRef();
    // videoRefs[i] = thisRef;
    return (
      <VideoPreview
        key={item.vidId}
        data={item}
        style={i === videoPreview.length - 1 ? { marginBottom: "15px" } : {}}
        selected={currentVideo === i}
        onVideoClick={() => onVideoClick(item.vidId, i)}
      />
    );
  });

  return (
    <React.Fragment>
      <div className={classes.mainDiv}>
        <Typography
          variant="h5"
          align="center"
          className={clsx(classes.drawerTitle, classes.sticky)}
        >
          Videos to Explore
        </Typography>
        {/* <Divider /> */}
        {/* <Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>System Performance Metrics</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.AccordionDetailsRoot}>
						<List classes={{padding: classes.listPadding}}>
							{listItems}
						</List>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>Most and Least Detected Components</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.AccordionDetailsRoot}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
							</Grid>
							<BarChart data={highPrecisionData} size={[400, 140]} id="high" color={highPrecision} title="Highest Precision"/> 
						</Grid>
					</AccordionDetails>
				</Accordion> */}
        {/* <Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography>Videos to Explore</Typography>
				</AccordionSummary>
				<AccordionDetails className={clsx(classes.AccordionDetailsRoot, classes.videoAccordion)}> */}
        <Grid
          container
          spacing={1}
          alignItems="center"
          justify="center"
          style={{ backgroundColor: "white" }}
        >
          {videoPreviewList}
        </Grid>
        {/* </AccordionDetails>
			</Accordion> */}
      </div>
    </React.Fragment>
  );
}
