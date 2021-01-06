import React, {useRef} from 'react';

// Note to self: CLSX is a dynmaic conditional class joining framework.
import clsx from 'clsx';

import { Drawer as MUIDrawer, Typography, AppBar, Toolbar, IconButton, Grid, Button, List, ListItem, ListItemText, ListItemIcon, TextField } from '@material-ui/core';
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import LaunchIcon from '@material-ui/icons/Launch';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles } from '@material-ui/core/styles';
import DrawerContent from './DrawerContent';
import VideoPlayer from './VideoPlayer';
import Dialoge from './Dialoge';
import globalInformation from './data/dset.json';

// These components are loaded for the draggable dilaoge box for the global information.
import Draggable from 'react-draggable';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CloseIcon from '@material-ui/icons/Close';
import {cyan, lightBlue, green, red, indigo, orange} from '@material-ui/core/colors';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


import BarChart from './BarChart';

//React.Fragment --> similar to div but for when you cannot have items within a div as they'll lose their functionality! 
// Use Fragment simialar to d3.group??

// Make sure to change the drawer width based on the size of the final drawer.
// Note the number is not a string or in pixels. The shifting won't work strings. The browser automatically translates this into pixels. (why?)
const drawerWidth = 410;
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		backgroundColor: theme.palette.primary.dark,
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	open : {
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
		padding: '10px',
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
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(3, 0)/2,
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	 },
	toolbar: {
		height: "41px",
		minHeight: "41px",
	},
	content: {
		flexGrow: 1,
		// padding: theme.spacing(3),
		paddingTop: '48px', // 48px is the height of the appbar
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
		// backgroundColor: "#f4f8ff",
		height: "100vp"

	},
	contentShift: {
		transition: theme.transitions.create('margin', {
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
	hidden:{
		display: "none",
	},
	fontSizeLarge: {
		fontSize:30,
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
	chartTitle: {

	},
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
	}
}));

export default function MainLayout() {
	const classes = useStyles();

	const drawerToggle = () => { setOpen(!open)};
	const dialogeOpen = () => {setDialogeOpen(true);};
	const dialogeClose = () => {setDialogeOpen(false);};

	const globalDialogeToggle = () => {setGlobalInfoOpen(!openGlobalInfo)}
	const globalDialogeClose = () => {setGlobalInfoOpen(false)}

	const notebookToggle = () => {setNotebookOpen(!openNotebook)}
	const notebookClose = () => {setNotebookOpen(false)}

	const [currentVidData, setVidData] = React.useState("probs.s13-d21.mp4.csv");
	const [currentVidSrc, setVidSrc] = React.useState("https://indie.cise.ufl.edu/Pineapple/assets/videos/s13-d21.mp4");

	// Callback function passed to the children (final stop, the button on the side panel to inspect video) and passed to onClick.
	const setVideoAndData = (videoName) => {
		const videoSrc = "https://indie.cise.ufl.edu/Pineapple/assets/videos/" + videoName +".mp4";
		const videoData = "probs." + videoName + ".mp4.csv";
		
		setVidSrc (videoSrc);
		setVidData(videoData);
	}

	const player = useRef(null); 

	const [open, setOpen] = React.useState(true);
	const [openDialoge, setDialogeOpen] = React.useState(false); //user Study task

	const [openGlobalInfo, setGlobalInfoOpen] = React.useState(true); //used to toggle open/close for the global info dialoge box
	const [openNotebook, setNotebookOpen] = React.useState(true); // used to toggle open/close the notebook (user study!)

	const globalInfo = globalInformation.globalInfo;
	const precisionData = globalInfo.objectPrecisionScores;

	const [items, setItems] = React.useState([
		{ text: "Overall Detection Accuracy", value: globalInfo.accuracy, icon: <FiberManualRecordIcon fontSize="large" style={{color:indigo.A700}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
		{ text: "Overall Wrongly Detected", value: globalInfo.falsePositiveRate, icon: <FiberManualRecordIcon fontSize="large" style={{color:red.A700}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
		{ text: "Overall Failed to Detect", value: globalInfo.falseNegativeRate, icon: <FiberManualRecordIcon fontSize="large" style={{color:orange.A700}} classes={{fontSizeLarge: classes.fontSizeLarge}}/> },
	]);
	const listItems = items.map((item, index) => {
		return (
			<ListItem key={index} classes={{root: classes.listItemRoot}}>
				<ListItemIcon classes={{root: classes.listIconRoot}}>
					{item.icon}
				</ListItemIcon>
				<ListItemText secondary={item.text} secondaryTypographyProps={{color:"textPrimary"}}/>
				<ListItemIcon color="secondary" classes={{root: classes.listIconRoot}}>
					{`${item.value}%`}
				</ListItemIcon>
			</ListItem>
		)
	});

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: open,})}>
				<Toolbar variant="dense" classes={{root: classes.toolbar}}>
					<IconButton aria-label="open drawer" onClick={drawerToggle} className={classes.menuButton}>
						<MenuOpenRoundedIcon className={clsx(!open && classes.close, open && classes.open)}/>
					</IconButton>
					<Typography variant="h6" noWrap>
						Global Visualization tool
          			</Typography>
					<div className={classes.navbarButtons}>
						<Button aria-label="open drawer" className={classes.navbarButton}
								startIcon={<LaunchIcon className={classes.flip}/>} onClick={globalDialogeToggle}>
							Global Information
						</Button>
						<Button aria-label="open drawer" className={classes.navbarButton}
								startIcon={<MenuBookIcon className={classes.flip}/>} onClick={notebookToggle}>
							Notepad
						</Button>
					</div>
					{/* <Button aria-label="open dialoge" onClick={dialogeOpen} startIcon={<AssignmentIcon />} 
							color="secondary" variant="contained" className={classes.userTaskButton}>
						User Study Task
					</Button> */}
				</Toolbar>
			</AppBar>
			<MUIDrawer variant="persistent" open={open} anchor="left" className={classes.drawer} classes={{ paper: classes.drawerPaper, }}>
				<DrawerContent onVideoClick={setVideoAndData}/>
			</MUIDrawer>
			<main className={clsx(classes.content, { [classes.contentShift]: open, })}>
				<div className={classes.drawerHeader}>
					 <Grid container spacing={1}>
					 	<Grid item md={7}>
							<VideoPlayer ref={player} source={currentVidSrc} data={currentVidData}/>
						</Grid>
						<Grid container item md={4} spacing={1}>
							<Grid item md={12}>
								{GlobalInfoCard(classes, openGlobalInfo, globalDialogeClose, listItems, precisionData)}
							</Grid>
							<Grid item md={12}>
								{Notebook(classes, openNotebook, notebookClose)}
							</Grid>
						</Grid>
					 </Grid>
				</div>
			</main>
			<Dialoge open={openDialoge} handleClose={dialogeClose}/>
		</div>
	)
}

function GlobalInfoCard(classes, openGlobalInfo, globalDialogeClose, listItems, precisionData) {
	return <Draggable handle="#globalInfo">
		<Card id="globalInfo" className={clsx(classes.cardStyle, !openGlobalInfo && classes.hidden)} raised="true" elevation={2}>
			<CardActions classes={{ root: classes.cardActionsRoot }}>
				<IconButton classes={{ root: classes.closeIconRoot }} onClick={globalDialogeClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</CardActions>
			<CardContent classes={{ root: classes.cardContentRoot }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<List classes={{ padding: classes.listPadding }}>
							{listItems}
						</List>
					</Grid>
					<Grid item container xs={12} spacing={1}>
						<Grid item xs={12}>
							<Typography variant="body1" className={classes.chartTitle}>Detection Confidence per <i className={classes.highlight}>Object</i></Typography>
						</Grid>
						<Grid item xs={12}>
							<BarChart data={precisionData} size={[310, 160]} id="high"/>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	</Draggable>;
}


function Notebook(classes, openNotebook, notebookClose) {
	const bullet = "\u2022";
	const bulletWithSpace = `${bullet} `;
	const enter = 13;

	const handleInput = (event) => {
		const { keyCode, target } = event;
		const { selectionStart, value } = target;

		if (keyCode === enter) {
			console.log('a');
			target.value = [...value]
				.map((c, i) => i === selectionStart - 1
					? `\n${bulletWithSpace}`
					: c
				)
				.join('');
			console.log(target.value);

			target.selectionStart = selectionStart + bulletWithSpace.length;
			target.selectionEnd = selectionStart + bulletWithSpace.length;
		}

		if (value[0] !== bullet) {
			target.value = `${bulletWithSpace}${value}`;
		}
	}
	return (
		<Draggable handle="#notebook">
				<Card id="notebook" className={clsx(classes.notebookCardStyle, !openNotebook && classes.hidden)} raised="true" elevation={2}>
					<CardActions classes={{ root: classes.cardActionsRoot }}>
						<IconButton classes={{ root: classes.closeIconRoot }} onClick={notebookClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</CardActions>
					<CardContent classes={{ root: classes.notebookCardContent }}>
						<Grid container spacing={2}>
							{/* <Grid item xs={12}>
								<Typography variant="body1" className={classes.chartTitle}>Hello</Typography>
							</Grid> */}
							<Grid item xs={12}>
								<TextField id="notebookText" className={classes.notebook} label="Use this area to take notes:" rows={11} variant="outlined" color="secondary"
											multiline helperText fullWidth size="small" onKeyUp={handleInput}/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
		</Draggable>
	);
}