import React from 'react';
import { Typography, Grid, Card, ListItem, ListItemIcon, ListItemText, CardMedia, CardContent, Chip, makeStyles, Divider, Button } from '@material-ui/core';
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import SearchIcon from '@material-ui/icons/Search';
import { green, red } from '@material-ui/core/colors';
// { "vid-id": "s23-d27", "id": 1, "tags": [ "cut", "wash", "carrot", "knife", "fridge", "cutting board" ] , "f-positive": 10, "f-negative": 15 },

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		border: 0,
		borderBottom: `1px solid ${theme.palette.primary.main}`,
		borderRadius: 0,
		'&:hover': {
			backgroundColor: theme.palette.secondary.transparent,
		},
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
		width: 280,
	 },
	cover: {
		height: 100,
		borderRadius: 3,
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
	},
	buttonIcon: {
		margin: 0,
	},
	button: {
		fontSize: '11px',
		padding: '1px 10px',
		margin: '8px 8px',
		color: theme.palette.primary.dark,
		border: "1px solid rgb(130 177 255 / 65%)",
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
    		color: "white",
		},
	},
	chip: {
		flexWrap: 'wrap',
		backgroundColor: theme.palette.secondary.light,
		'&:hover': {
			backgroundColor: theme.palette.secondary.main,
			opacity: 0.8
		},
	},
	mainGrid: {
		padding: `0px ${theme.spacing(1)/2}px !important`,
	},
	listItemIconRoot: {
		fontSize: '0.75rem',
	}
}));

export default function VideoPreview(props) {
	const classes = useStyles();
	const data = props.data;
	const videoChips =
		<div className={classes.rootDiv}>
			<Typography variant="subtitle2">Top 5 Components:</Typography>
			{data.tags.map((tag, index) => {
				return (
					<Chip size="small" label={tag} key={index} className={classes.chip}/>
					// <Typography variant="caption" key={index} className={classes.tag} noWrap>{tag}</Typography>
				)
			})}
		</div>

	const performanceData = [
		{"value":data.fPositive, "text": "False Positive", "icon": <AddBoxRoundedIcon style={{color:green.A700}}/>}, 
		{"value":data.fNegative, "text": "False Negative", "icon": <IndeterminateCheckBoxIcon style={{color:red[500]}}/>}
	];
	const videoStatus = performanceData.map((item, index) => {
		return (
			<ListItem key={index} className={classes.listItemRoot}>
				<ListItemIcon >
					{item.icon}
				</ListItemIcon>
				<ListItemText secondary={item.text} secondaryTypographyProps={{color:"textPrimary"}}/>
				<ListItemIcon color="secondary" classes={{root: classes.listItemIconRoot}}>
					{`${item.value}%`}
				</ListItemIcon>
			</ListItem>
		)
	});
	
	
	return (
		<Grid item xs={12} style={props.style} className={classes.mainGrid}>
			<Card variant="outlined" classes={{root: classes.root}}>
				<div style={{alignItems:'center'}}>
					<CardMedia component="img" image={require(`../public/thumbnails/${data.vidId}.png`)} className={classes.cover} />
					<Button color="primary" size="small" variant="outlined" startIcon={<SearchIcon />} onClick={props.onVideoClick}
						classes={{startIcon: classes.buttonIcon, outlinedPrimary: classes.button}}> Inspect Video </Button>
				</div>
				<div className={classes.details}>
					<CardContent className={classes.cardContent}>
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
