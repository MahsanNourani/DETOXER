import React from 'react';
import { Typography, Grid, Card, ListItem, ListItemIcon, ListItemText, CardMedia, CardContent, Chip, makeStyles, List, Divider, Box } from '@material-ui/core';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { green, red } from '@material-ui/core/colors';
// { "vid-id": "s23-d27", "id": 1, "tags": [ "cut", "wash", "carrot", "knife", "fridge", "cutting board" ] , "f-positive": 10, "f-negative": 15 },

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		border: "1px solid #afadae52",
		// alignItems: "center"
	 },
	rootDiv: {
		display: 'flex',
		justifyContent: 'left',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(0.5),
		},
	},
	listItemRoot: {
		paddingTop: 0,
		paddingBottom: 0,
		width: 300,
	},
	cardContent: {
		padding: "4px",
		paddingBottom: "4px!important",
		paddingLeft: "10px",
		flex: '1 0 auto',
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
	 },
	cover: {
		width: 100,
		height: 100,
	},
	// tag: {
	// 	// border: `0.5px solid ${theme.palette.secondary.main}`,
	// 	backgroundColor: theme.palette.secondary.dark,
	// 	color: theme.palette.secondary.contrastText,
	// 	// color: "#281644",
	// 	fontSize: "13px",
	// 	borderRadius: "3px",
	// 	padding: '3px',
	// 	marginRight: '2px',
	// }
	divider: {
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(1),
	}
}));

export default function VideoPreview(props) {
	const classes = useStyles();
	const data = props.data;
	const videoChips =
		<div className={classes.rootDiv}>
			{data.tags.map((tag, index) => {
				return (
					<Chip variant="outlined" color="secondary" size="small" label={tag} key={index}/>
					// <Typography variant="caption" key={index} className={classes.tag} noWrap>{tag}</Typography>
				)
			})}
		</div>

	const performanceData = [
		{"value":data.fPositive, "text": "Flase Positives", "icon": <AddBoxRoundedIcon style={{color:green.A700}}/>}, 
		{"value":data.fNegative, "text": "Flase Negatives", "icon": <IndeterminateCheckBoxIcon style={{color:red[500]}}/>}
	];
	const videoStatus = performanceData.map((item, index) => {
		return (
			<ListItem key={index} className={classes.listItemRoot}>
				<ListItemIcon >
					{item.icon}
				</ListItemIcon>
				<ListItemText secondary={item.text} secondaryTypographyProps={{color:"textPrimary"}}/>
				<ListItemIcon color="secondary">
					{`${item.value}%`}
				</ListItemIcon>
			</ListItem>
		)
	});
	
	
	return (
		<Grid item xs={12} style={props.style}>
			<Card className={classes.root}>
				<CardMedia component="img" image={require(`../public/thumbnails/${data.vidId}.jpg`)} className={classes.cover} />
				<div className={classes.details}>
					<CardContent className={classes.cardContent}>
						<Typography variant="subtitle2">Top 5 Components:</Typography>
						{videoChips}
						<Divider className={classes.divider}/>
						<Typography variant="subtitle2">Estimations:</Typography>
						{videoStatus}
					</CardContent>
				</div>
			</Card>
		</Grid>
	)
}
