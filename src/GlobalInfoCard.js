import React from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { Typography, IconButton, Grid, List, ListItem, ListItemIcon, ListItemText, Card, CardActions, CardContent} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {red, indigo, orange} from '@material-ui/core/colors';
import BarChart from './BarChart';

import globalInformation from './data/dset.json';

const useStyles = makeStyles(theme => ({
	cardStyle: {
		minWidth: 400,
		cursor: "move",
	},
	hidden:{
		display: "none",
	},
	fontSizeLarge: {
		fontSize:30,
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
	closeIconRoot: {
		marginLeft: "auto",
	},
}));


export default function GlobalInfoCard(props) {

    const classes = useStyles();

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
	return <Draggable handle="#globalInfo">
		<Card id="globalInfo" className={clsx(classes.cardStyle, !props.open && classes.hidden)} elevation={2}>
			<CardActions classes={{ root: classes.cardActionsRoot }}>
				<IconButton classes={{ root: classes.closeIconRoot }} onClick={props.close}>
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
							<BarChart data={precisionData} size={[310, 160]} id="high" />
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	</Draggable>;
}
