//Should be in the user-Study Branch only

import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Grid, ListItemSecondaryAction, Switch, ListSubheader, Input, InputLabel, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
		backgroundColor: theme.palette.secondary.main,
		color: "black",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	main: {
		marginTop: theme.spacing(2)
	},
	listOfThingsGrid: {
		border: `1px solid ${theme.palette.primary.light}`,
		borderRadius: 3,
		margin: theme.spacing(1),
	},
	listSubheaderRoot: {
		color: theme.palette.primary.main,
		fontSize: "1rem",
		fontWeight: "bold",
	},
	switchLabel: {
		fontSize: "0.8rem",
		margin: theme.spacing(1),
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(props.open);
	const [checked, setChecked] = React.useState([]);
	const [accuracy, setAccuracy] = React.useState(undefined);

  const handleAccuracyChange = (event) => {
    setAccuracy(event.target.value);
  };
	useEffect(() => {
		//   console.log('props.open ', props.open );
		if (props.open == true)
			setOpen(props.open);
	}, [props.open]);

	const handleClose = () => {
		props.handleClose();
		setOpen(false);
	};
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
	};
	
	const handleSubmit = () => {
		console.log("this is checked: ", checked);
		console.log("accuracy is: ", accuracy);
	}

	const components = ["Carrot", "Sink", "Cucumber", "Dry"];
	const thingsToAsk = [{title:"False Positive", nickname:"FP"}, {title:"False Negative", nickname:"FN"},];

	const listOfThingsToAsk = components.map((item, index) => {
		return (
			<Grid item xs={5} className={classes.listOfThingsGrid}>
				<List subheader={<ListSubheader classes={{root: classes.listSubheaderRoot}}>{item}</ListSubheader>} key={`${item}${index}`}>
					{
						thingsToAsk.map((thing, idx) => {
							return (
								<ListItem key={`${item}${thing.nickname}${thing.idx}`}>
									<ListItemText id={`${item}${thing.nickname}`} primary={thing.title}/>
									<ListItemSecondaryAction>
										<FormControlLabel label="observed" labelPlacement="end" classes={{label: classes.switchLabel}}
										  control={<Switch edge="end" onChange={handleToggle(`${item}${thing.nickname}`)} checked={checked.indexOf(`${item}${thing.nickname}`) !== -1}
														           inputProps={{ 'aria-labelledby': `${item}${thing.nickname}`}} />}
										/>
									</ListItemSecondaryAction>
								</ListItem>
							)
						})
					}
				</List>
			</Grid>
		)})

	return (
		<div>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							User Study Task
            </Typography>
					</Toolbar>
				</AppBar>
				<Grid container justify="center" alignItems="center" className={classes.main}>
					<Grid item xs={8} container>
						<Grid item xs={12}>
							<Typography variant="h6" style={{textAlign: 'justify'}}>
								For each of the components below, please select all that apply. To do so, you should explore the component within the system.
								You can switch back and forth between this panel and the main system.
							</Typography>
						</Grid>
						<Grid item xs={12} container justify="center" alignItems="center">
							{listOfThingsToAsk}
						</Grid>
						<Grid item xs={12} container justify="center" alignItems="center" style={{marginBottom: "8px"}}>
							<Grid item xs={8}>
								<Typography variant="h6">
									What do you think the system overall accuracy is?
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<form className={classes.root} noValidate autoComplete="off">
									<Input inputProps={{ 'aria-label': 'accuracy'}} endAdornment={<InputAdornment position="end">%</InputAdornment>}
												 type="number" id="accuracy" value={accuracy || ""} onChange={handleAccuracyChange}/>
									<InputLabel htmlFor="accuracy" color="primary" shrink>Accuracy Percentage</InputLabel>
								</form>
							</Grid>
						</Grid>
						<Grid item xs={2} style={{marginLeft: "auto"}}>
							<Button variant="contained" color="primary" onClick={handleSubmit}>
								Submit
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Dialog>
		</div>
	);
}
