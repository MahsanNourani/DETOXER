import React from 'react';
import { List, Typography, ListItem, ListItemText, ListItemIcon, Grid, AccordionDetails } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core'; 
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import BarChart from './BarChart';
import {cyan, yellow, lightBlue} from '@material-ui/core/colors';
import VideoPreview from './VideoPreview';
import { green, red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import clsx from 'clsx';
import drawerContent from './dummy_dset.json';

const useStyles = makeStyles(theme => ({
	listIcon: {
		color: theme.palette.secondary.dark,
	},
	listIconRoot: {
		fontSize: "3rem",
	},
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
		marginBottom:5,
	},
	drawerTitle: {
		fontWeight: "bold",
		color: theme.palette.primary.dark,
		border: "1px solid #e0e0e0",
		borderRadius: "3px",
		marginBottom: theme.spacing(1),
	},
	sticky: {
		position: '-webkit-sticky',
		position: 'sticky',
		backgroundColor: 'white',
		top: 0,
		bottom: 10,
		zIndex: 5,
		backgroundColor:'white'
	},
	videoAccordion: {
		maxHeight: '580px',
		overflowY: 'scroll',
	}
}));

const Accordion = withStyles(theme => ({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		// borderBottom: 'none',
		// borderTop: 'none',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			margin: 'auto',
		},
	},
	expanded: {},
}))(MuiAccordion);

// AccordionSummaryRoot: {
// 	minHeight: "37px!important",
// 	height: "37px!important",
// },
// AccordionSummaryExpanded: {
// 	minHeight: "40px!important",
// 	height: "40px!important",
// },
const AccordionSummary = withStyles(theme => ({
	root: {
		//   backgroundColor: 'rgba(0, 0, 0, .03)',
		//   borderBottom: '1px solid rgba(0, 0, 0, .125)',
		backgroundColor: theme.palette.primary.dark,//#3F51B5
		color: "white",
		marginBottom: -1,
		minHeight: 35,
		'&$expanded': {
			minHeight: 37,
		},
	},
	content: {
		fontWeight: "900!important",
		'&$expanded': {
			margin: '12px 0',
		},
	},
	expandIcon: {
		color: "white",
	},
	expanded: {},
}))(MuiAccordionSummary);

const highPrecision = cyan[400];
const lowPrecision  = yellow[600];


export default function DrawerContent() {
	const classes = useStyles();
	// TODO for later: I need to read this info from the dataset.

	const globalInfo = drawerContent.globalInfo;

	const [items, setItems] = React.useState([
		{ text: "Model Accuracy", value: globalInfo.accuracy, icon: <SettingsApplicationsIcon style={{color:lightBlue.A700}}/> },
		{ text: "Estimation of False Positives", value: globalInfo.falsePositiveRate, icon: <AddBoxRoundedIcon style={{color:green.A700}}/> },
		{ text: "Estimation of False Negatives", value: globalInfo.falseNegativeRate, icon: <IndeterminateCheckBoxIcon style={{color:red[500]}}/> },
	]);
	const listItems = items.map((item, index) => {
		return (
			<ListItem key={index}>
				<ListItemIcon classes={{root: classes.listIconRoot}}>
					{item.icon}
				</ListItemIcon>
				<ListItemText primary={item.text} />
				<ListItemIcon color="secondary">
					{`${item.value}%`}
				</ListItemIcon>
			</ListItem>
		)
	});

	const highPrecisionData = globalInfo.highestPrecisionObjects;
	const lowPrecisionData = globalInfo.lowestPrecisionObjects;

	// the video name and the thumbnail name should be the same! Each video will only have one thumbnail.
	const videoPreview = drawerContent.videoInfo;

	const videoPreviewList = videoPreview.map ((item, i) => {
		return (
			<VideoPreview key={item.id} data={item} style ={(i===videoPreview.length -1 ? {marginBottom: "15px"} : {})}/>
		)
	})

	return (
		<React.Fragment>
			<div> {/* className={classes.sticky}*/}
				<Typography variant="h5" align="center" className={classes.drawerTitle}>
					Global Information
				</Typography>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>System Performance Metrics</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.AccordionDetailsRoot}>
						<List className={classes.list}>
							{listItems}
						</List>
					</AccordionDetails>
				</Accordion>

				{/* <Divider className={classes.dividerBottom}/> */}
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>Most and Least Detected Components</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.AccordionDetailsRoot}>
						<Grid container spacing={2}> {/* BarCharts include Grid item themselves */}
							<Grid item xs={12}>
								{/* <Typography variant="h6" color="textPrimary"> Components with:</Typography> */}
							</Grid>
							{/* Originally, size={[200, 150]} with drawer size 400-450px */}
							<BarChart data={highPrecisionData} size={[200, 120]} id="high" color={highPrecision} title="Highest Precision"/> 
							<BarChart data={lowPrecisionData} size={[200, 120]} id="low" color={lowPrecision} title="Lowest Precision"/>
						</Grid>
					</AccordionDetails>
				</Accordion>

				{/* <Divider className={classes.dividerTop}/> */}

				{/* <Typography variant="h6" color="textPrimary" className={classes.chartTitle}> Videos to Explore:</Typography> */}
			
			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography>Videos to Explore</Typography>
				</AccordionSummary>
				<AccordionDetails className={clsx(classes.AccordionDetailsRoot, classes.videoAccordion)}>
					<Grid container spacing={2} alignItems="center" justify="center">
						{videoPreviewList}
					</Grid>
				</AccordionDetails>
			</Accordion>
			</div>
		</React.Fragment>
	)
}