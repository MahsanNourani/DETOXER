import React from "react";
import {
  Typography,
  Grid,
  Card,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
  CardContent,
  Chip,
  makeStyles,
  Divider,
  Button,
  Zoom,
  Tooltip,
} from "@material-ui/core";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import SearchIcon from "@material-ui/icons/Search";
import HelpIcon from "@material-ui/icons/Help";
import { green, red } from "@material-ui/core/colors";
import clsx from "clsx";
// { "vid-id": "s23-d27", "id": 1, "tags": [ "cut", "wash", "carrot", "knife", "fridge", "cutting board" ] , "f-positive": 10, "f-negative": 15 },

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    border: 0,
    // borderBottom: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
    "&:hover": {
      backgroundColor: theme.palette.secondary.transparent,
    },
  },
  rootDiv: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    width: 270,
  },
  cardContent: {
    padding: "4px",
    paddingBottom: "4px!important",
    paddingLeft: "10px",
    flex: "1 0 auto",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: 280,
  },
  cover: {
    height: 100,
    borderRadius: 3,
  },
  divider: {
    marginBottom: theme.spacing(1) / 2,
    marginTop: theme.spacing(1) / 2,
    backgroundColor: "#ef9a9a",
  },
  buttonIcon: {
    margin: 0,
  },
  button: {
    fontSize: "11px",
    padding: "1px 10px",
    margin: "8px 8px",
    color: theme.palette.primary.dark,
    border: "1px solid rgb(130 177 255 / 65%)",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      color: "white",
    },
  },
  chip: {
    flexWrap: "wrap",
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      opacity: 0.8,
    },
  },
  mainGrid: {
    padding: `0px ${theme.spacing(1) / 2}px !important`,
  },
  listItemIconRoot: {
    fontSize: "0.75rem",
  },
  chipsTitle: {
    writingMode: "vertical-rl",
    transform: "rotate(-180deg)",
    fontSize: "0.8rem",
    textAlign: "center",
    color: theme.palette.primary.dark,
  },
  hidden: {
    visibility: "hidden",
  },
}));
// writing-mode: vertical-rl;
//     transform: rotate(-180deg);
export default function VideoPreview(props) {
  const classes = useStyles();
  const data = props.data;

  const condition = parseInt(localStorage.getItem("cond"));

  const videoChips = (
    <Grid container className={classes.rootDiv} spacing={1}>
      <Grid item md={1} className={classes.chipsTitle}>
        {/* <Typography variant="subtitle2"> */}
        Top Detected <br /> Components
      </Grid>
      <Grid item container md={10} spacing={1}>
        {data.tags.map((tag, index) => {
          return (
            <Grid item key={`${data.vidId}-${tag}`}>
              <Chip
                size="small"
                label={`${index + 1}. ${tag}`}
                className={classes.chip}
              />
            </Grid>
            // <Typography variant="caption" key={index} className={classes.tag} noWrap>{tag}</Typography>
          );
        })}
      </Grid>
    </Grid>
  );

  const performanceData = [
    {
      value: data.fPositive,
      text: "False Positives",
      icon: <AddBoxRoundedIcon style={{ color: green.A700 }} />,
      tooltip:
        "A result that shows something is present when it really is not.",
    },
    {
      value: data.fNegative,
      text: "False Negatives",
      icon: <IndeterminateCheckBoxIcon style={{ color: red[500] }} />,
      tooltip:
        "An incorrect indication that something is not present when it really is.",
    },
  ];
  const videoStatus = performanceData.map((item, index) => {
    return (
      <ListItem key={`${data.vidId}-${index}`} className={classes.listItemRoot}>
        {/* <ListItemIcon >
					{item.icon}
				</ListItemIcon> */}
        <Tooltip
          title={<h3> {item.tooltip} </h3>}
          TransitionComponent={Zoom}
          arrow
          enterDelay={1000}
        >
          <ListItemText
            secondary={item.text}
            secondaryTypographyProps={{ color: "textPrimary" }}
            className={clsx({ [classes.hidden]: !condition })}
          />
        </Tooltip>
        <ListItemIcon
          color="secondary"
          classes={{ root: classes.listItemIconRoot }}
          className={clsx({ [classes.hidden]: !condition })}
        >
          {`${item.value}%`}
        </ListItemIcon>
      </ListItem>
    );
  });

  return (
    <Grid item xs={12} style={props.style} className={classes.mainGrid}>
      <Card variant="outlined" classes={{ root: classes.root }}>
        <div style={{ alignItems: "center", marginLeft: 4 }}>
          <CardMedia
            component="img"
            image={require(`../public/thumbnails/${data.vidId}.png`)}
            className={classes.cover}
          />
          <Button
            color="secondary"
            size="small"
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={props.onVideoClick}
            classes={{
              startIcon: classes.buttonIcon,
              outlinedSecondary: classes.button,
            }}
          >
            {" "}
            Inspect Video{" "}
          </Button>
        </div>
        <div className={classes.details}>
          <CardContent className={classes.cardContent}>
            {videoChips}
            <Divider
              className={clsx({
                [classes.divider]: true,
                [classes.hidden]: !condition,
              })}
            />
            <Grid container spacing={1}>
              <Grid
                item
                md={1}
                className={clsx({
                  [classes.chipsTitle]: true,
                  [classes.hidden]: !condition,
                })}
              >
                Detection <br /> Errors
              </Grid>
              <Grid item md={8}>
                {videoStatus}
              </Grid>
            </Grid>
          </CardContent>
        </div>
      </Card>
      <Divider className={classes.divider} />
    </Grid>
  );
}
