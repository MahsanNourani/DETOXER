import React from 'react';
import { List, Typography, Icon, ListItem, ListItemText, ListItemIcon, Divider, makeStyles, Grid } from '@material-ui/core';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import BarChart from './BarChart';
import {cyan, yellow, lightBlue} from '@material-ui/core/colors';
import VideoPreview from './VideoPreview';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
	listIcon: {
		color: theme.palette.secondary.dark,
		// fontSize: 20,
		// width:50,
		// height:50,
		// fontSize: () => {
		// 	return (theme.typography.fontSize + 100);
		// }
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
	},
	sticky: {
		position: '-webkit-sticky',
		position: 'sticky',
		backgroundColor: 'white',
		top: 0,
		bottom: 10,
		zIndex: 5,
		backgroundColor:'white'
	}
}));

const highPrecision = cyan[400];
const lowPrecision  = yellow[600];


export default function DrawerContent() {
	const classes = useStyles();
	// TODO for later: I need to read this info from the dataset.

	const [items, setItems] = React.useState([
		{ text: "Model Accuracy", value: 85, icon: <SettingsApplicationsIcon style={{color:lightBlue.A700}}/> },
		{ text: "Estimation of False Positives", value: 20, icon: <AddBoxRoundedIcon style={{color:green.A700}}/> },
		{ text: "Estimation of False Negatives", value: 33, icon: <IndeterminateCheckBoxIcon style={{color:red[500]}}/> },
	]);
	const listItems = items.map((item, index) => {
		return (
			<ListItem key={index}>
				<ListItemIcon className={classes.listIcon}>
					{item.icon}
				</ListItemIcon>
				<ListItemText primary={item.text} />
				<ListItemIcon color="secondary">
					{`${item.value}%`}
				</ListItemIcon>
			</ListItem>
		)
	});

	const highPrecisionData = [
		{ "object": "carrot", "score": 100 },
		{ "object": "potato", "score": 76 },
		{ "object": "bean",   "score": 80 }

	]
	const lowPrecisionData = [
		{ "object": "knife", "score": 25 },
		{ "object": "sink", "score": 14 },
		{ "object": "cutting board",  "score": 10 }

	]

	// the video name and the thumbnail name should be the same! Each video will only have one thumbnail.
	const videoPreview = [
		{ "vidId": "s23-d27", "id": 1, "tags": [ "cut", "wash", "carrot", "knife", "fridge" ] , "fPositive": 10, "fNegative": 15 },
		{ "vidId": "s22-d25", "id": 2, "tags": [ "cut", "wash", "carrot", "knife" ] , "fPositive": 40, "fNegative": 30 },
		{ "vidId": "s13-d17", "id": 3, "tags": [ "cut", "wash", "carrot", "knife","plate" ] , "fPositive": 10, "fNegative": 15 },
		{ "vidId": "s23-d17", "id": 4, "tags": [ "cut", "peel", "potato", "peeler", "cutting board" ] , "fPositive": 8, "fNegative": 10 },
		{ "vidId": "s23-d17", "id": 5, "tags": [ "cut", "peel", "potato", "fridge", "cutting board" ] , "fPositive": 8, "fNegative": 10 },
		{ "vidId": "s23-d17", "id": 6, "tags": ["peeler", "fridge", "cutting board" ] , "fPositive": 8, "fNegative": 10 }
	];

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
				<List className={classes.list}>
					{listItems}
				</List>
				<Divider className={classes.dividerBottom}/>
				<Grid container spacing={2}> {/* BarCharts include Grid item themselves */}
					<Grid item xs={12}>
						<Typography variant="h6" color="textPrimary"> Components with:</Typography>
					</Grid>
					{/* Originally, size={[200, 150]} with drawer size 400-450px */}
					<BarChart data={highPrecisionData} size={[200, 120]} id="high" color={highPrecision} title="Highest Precision"/> 
					<BarChart data={lowPrecisionData} size={[200, 120]} id="low" color={lowPrecision} title="Lowest Precision"/>
				</Grid>
				<Divider className={classes.dividerTop}/>
				<Typography variant="h6" color="textPrimary" className={classes.chartTitle}> Videos to Explore:</Typography>
			</div>
			<Grid container spacing={2} alignItems="center" justify="center">
				{videoPreviewList}
			</Grid>
		</React.Fragment>
	)
}
