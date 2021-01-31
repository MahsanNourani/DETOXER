import React from "react";
import Draggable from "react-draggable";
import clsx from "clsx";
import {
  Typography,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Tooltip,
  Zoom,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { red, indigo, orange } from "@material-ui/core/colors";
import BarChart from "./BarChart";

import globalInformation from "./data/dset.json";

const useStyles = makeStyles((theme) => ({
  cardStyle: {
    minWidth: 400,
    cursor: "move",
  },
  hidden: {
    display: "none",
  },
  fontSizeLarge: {
    fontSize: 25,
  },
  listPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listIconRoot: {
    fontSize: "0.75rem",
  },
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
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
    marginLeft: "auto!important",
  },
}));

export default function GlobalInfoCard(props) {
  const classes = useStyles();

  const globalInfo = globalInformation.globalInfo;
  const precisionData = globalInfo.objectPrecisionScores;

  const [items, setItems] = React.useState([
    {
      text: "Overall Detection Accuracy",
      value: globalInfo.accuracy,
      icon: (
        <CheckCircleIcon
          fontSize="large"
          style={{ color: indigo.A700 }}
          classes={{ fontSizeLarge: classes.fontSizeLarge }}
        />
      ),
      tooltip:
        "Informally, accuracy is the fraction of predictions our model got right.",
    },
    {
      text: "Overall False Positives",
      value: globalInfo.falsePositiveRate,
      icon: (
        <ErrorIcon
          fontSize="large"
          style={{ color: red.A700 }}
          classes={{ fontSizeLarge: classes.fontSizeLarge }}
        />
      ),
      tooltip:
        "A result that shows something is present when it really is not.",
    },
    {
      text: "Overall False Negatives",
      value: globalInfo.falseNegativeRate,
      icon: (
        <ErrorIcon
          fontSize="large"
          style={{ color: red.A700 }}
          classes={{ fontSizeLarge: classes.fontSizeLarge }}
        />
      ),
      tooltip:
        "An incorrect indication that something is not present when it really is.",
    },
  ]);
  const listItems = items.map((item, index) => {
    return (
      <ListItem key={index} classes={{ root: classes.listItemRoot }}>
        <ListItemIcon classes={{ root: classes.listIconRoot }}>
          {item.icon}
        </ListItemIcon>
        <Tooltip
          title={<h3> {item.tooltip} </h3>}
          TransitionComponent={Zoom}
          arrow
          enterDelay={1000}
        >
          <ListItemText
            secondary={item.text}
            secondaryTypographyProps={{ color: "textPrimary" }}
          />
        </Tooltip>
        <ListItemIcon
          color="secondary"
          classes={{ root: classes.listIconRoot }}
        >
          {`${item.value}%`}
        </ListItemIcon>
      </ListItem>
    );
  });
  return (
    <Draggable handle="#globalInfo">
      <Card
        id="globalInfo"
        className={clsx(classes.cardStyle, !props.open && classes.hidden)}
        elevation={2}
      >
        <CardActions classes={{ root: classes.cardActionsRoot }}>
          <CardHeader title="Global Information" />
          <IconButton
            classes={{ root: classes.closeIconRoot }}
            onClick={props.close}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </CardActions>
        <CardContent classes={{ root: classes.cardContentRoot }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <List classes={{ padding: classes.listPadding }}>
                {listItems}
              </List>
            </Grid>
            <Grid item container xs={12} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1" className={classes.chartTitle}>
                  <u>False Positive</u> rate per{" "}
                  <i className={classes.highlight}>Object</i>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <BarChart
                  data={precisionData}
                  size={[310, 160]}
                  id="FPBarchart"
                  score="fpr"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" className={classes.chartTitle}>
                  <u>False Negative</u> rate per{" "}
                  <i className={classes.highlight}>Object</i>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <BarChart
                  data={precisionData}
                  size={[310, 160]}
                  id="FNBarchart"
                  score="fnr"
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Draggable>
  );
}
