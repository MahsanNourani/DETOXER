import React from 'react';
import Draggable from 'react-draggable';
import clsx from 'clsx';
import { IconButton, Grid, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { createInputLog } from './Logger';

const useStyles = makeStyles(theme => ({
	notebookCardStyle: {
		minWidth: 400,
		cursor: "move",
		backgroundColor: theme.palette.secondary.notebook,
	},
	hidden:{
		display: "none",
	},
	cardActionsRoot: {
		padding: 0,
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

export default function Notebook(props) {

    const classes = useStyles();

	const bullet = "\u2022";
	const bulletWithSpace = `${bullet} `;
	const enter = 13;

	const handleInput = (event) => {
		const { keyCode, target } = event;
		const { selectionStart, value } = target;

		if (keyCode === enter) {
			target.value = [...value]
				.map((c, i) => i === selectionStart - 1
					? `\n${bulletWithSpace}`
					: c
				)
				.join('');

			target.selectionStart = selectionStart + bulletWithSpace.length;
			target.selectionEnd = selectionStart + bulletWithSpace.length;
		}

		if (value[0] !== bullet) {
			target.value = `${bulletWithSpace}${value}`;
		}
	};
	return (
		<Draggable handle="#notebook">
			<Card id="notebook" className={clsx(classes.notebookCardStyle, !props.open && classes.hidden)} elevation={2}>
				<CardActions classes={{ root: classes.cardActionsRoot }}>
					<IconButton classes={{ root: classes.closeIconRoot }} onClick={props.close}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</CardActions>
				<CardContent classes={{ root: classes.notebookCardContent }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField id="notebookText" className={classes.notebook} label="Use this area to take notes:" rows={11} variant="outlined" color="secondary"
								multiline fullWidth size="small" onKeyUp={handleInput} onFocus={() => createInputLog("clk_note")} />
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Draggable>
	);
}
