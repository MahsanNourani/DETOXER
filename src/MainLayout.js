import React, {useRef} from 'react';

// Note to self: CLSX is a dynmaic conditional class joining framework.
import clsx from 'clsx';

import { Drawer as MUIDrawer, Typography, AppBar, Toolbar, IconButton, Grid } from '@material-ui/core';
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import { makeStyles } from '@material-ui/core/styles';
import DrawerContent from './DrawerContent';
import VideoPlayer from './VideoPlayer';
// import {pink} from '@material-ui/core/colors';

//React.Fragment --> similar to div but for when you cannot have items within a div as they'll lose their functionality! 
// Use Fragment simialar to d3.group??

// Make sure to change the drawer width based on the size of the final drawer.
// Note the number is not a string or in pixels. The shifting won't work strings. The browser automatically translates this into pixels. (why?)
const drawerWidth = 400;
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
	menuButton: {
		marginRight: theme.spacing(2),
		color: theme.palette.primary.contrastText,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		padding: '10px',
	},
	// With this below, the size will be set to the drawerWidth. Without it, it will fit the content.
	drawerPaper: {
		width: drawerWidth,
		padding: '10px',
		maxHeight: "100vh",
		overflowY: "hidden",
		borderTop: 0,
		backgroundColor: "#f4f8ff",
	},

	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(3, 0),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	 },

	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		paddingTop: '48px', // 48px is the height of the appbar
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
		backgroundColor: "#f4f8ff",
		height: "100vp"

	},

	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}
}));

export default function MainLayout() {
	const classes = useStyles();

	// const drawerOpen = () => { setOpen(true) };
	// const drawerClose = () => { setOpen(false) };
	const drawerToggle = () => { setOpen(!open) };

	const [currentVidData, setVidData] = React.useState("");
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

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: open,})}>
				<Toolbar variant="dense">
					<IconButton aria-label="open drawer" onClick={drawerToggle} className={classes.menuButton}>
						<MenuOpenRoundedIcon className={clsx(!open && classes.close, open && classes.open)}/>
					</IconButton>
					<Typography variant="h6" noWrap>
						Global Visualization tool
          		</Typography>
				</Toolbar>
			</AppBar>
			<MUIDrawer variant="persistent" open={open} anchor="left" className={classes.drawer} classes={{ paper: classes.drawerPaper, }}>
				<DrawerContent onVideoClick={setVideoAndData}/>
			</MUIDrawer>
			<main className={clsx(classes.content, { [classes.contentShift]: open, })}>
				<div className={classes.drawerHeader}>
					 <Grid container>
					 	<Grid item md={6}>
							<VideoPlayer ref={player} source={currentVidSrc} data={currentVidData}/>
						</Grid>
					 </Grid>
				</div>
			</main>
		</div>
	)
}