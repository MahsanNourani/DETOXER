import React, {useEffect} from 'react';
import {makeStyles, Grid, Typography, withStyles} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import './videoPlayer.css';
import Heatmap from './Heatmap';
import * as d3 from 'd3';
import clsx from 'clsx';


const useStyles = makeStyles (theme => ({
    slider: {
        width: "100%",
    },
    progressBarGrid: {
        // padding: theme.spacing(3, 2),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    heatmapContainer: {
        maxHeight: 300,
        overflow: "auto",
        border: "1px solid #3a4cb13d",
        borderRadius: "3px",
        position: "relative",
        // overflowY: "scroll",
        marginTop: theme.spacing(1),
    },
    sliderBar: {
        backgroundColor: "#3a4cb1c9",
        width: "2px",
        position: "absolute",
        // left: ,
    },
    sliderBarShort: {
        height: "254%",
    },
    slideBarTall: {
        height: "360%"
    },
    iconRoot: {
        padding: theme.spacing(1)/2,
    },
    legendBox: {
        marginTop: "10px",
        border: "1px solid #3a4cb194",
        borderRadius: "3px",
    }
}));



export const PlayToggleButton = (props) => {

    const classes = useStyles();

    const clicked = (e) => props.onClick(e);

    return(
        (props.playing) ?
        <IconButton aria-label="play" onClick={clicked} classes={{root: classes.iconRoot}}>
            <PauseIcon fontSize="small"/>
        </IconButton> :
        <IconButton aria-label="pause" onClick={clicked} classes={{root: classes.iconRoot}}>
            <PlayArrowIcon fontSize="small"/>
        </IconButton>
    );
}
export const ResetButton = (props) => {
    const classes = useStyles();

    const clicked = (e) => props.onClick(e);

    return(
        <IconButton aria-label="reset" onClick={clicked} classes={{root: classes.iconRoot}}>
            <ReplayIcon fontSize="small"/>
        </IconButton> 
    );
}

export const ProgressBar = (props) => {

    const classes = useStyles();

    const [sliderValue, setSliderValue] = React.useState(props.played);
    const onInputSlider = () => {
        const slider = document.getElementById("progressBar");
        slider.style.background = 
            'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + slider.value*100 + '%, #fff ' + slider.value*100 + '%, white 100%)';
    }

    const changeMovingBar = (t) => {
        let bar = document.getElementById("movingBar");
        const svgWidth = document.getElementsByClassName("svgParent")[0].clientWidth + 0.4;
        const offsetLeft = document.getElementsByClassName("svgParent")[0].offsetLeft;

        let newValue = parseFloat(t)*svgWidth + offsetLeft;
        bar.style.left = newValue + "px";
    }
    
    const handleSeekMouseDown = e => props.down(e);
    const handleSeekChange = (e, newValue) => {
        props.change(e);
        changeMovingBar(e.target.value);
    }
    const handleSeekMouseUp = e => {
        props.up(e);
        setSliderValue(e.target.value);
        changeMovingBar(e.target.value);
    }
    return(
        <input id="progressBar" type="range" min="0" max="0.9999" step="any" value={props.played} onMouseDown={handleSeekMouseDown} 
            onChange={handleSeekChange} onMouseUp={handleSeekMouseUp} className={`${classes.slider} slider`}/>
    );
}

export const PlayerControls = (props) => {
    const classes = useStyles();
    
    // Slightly different function than the one in the previous function, because the 't' is different. 
    // In the other one, it's the clicked seek time as percentage and in this one, it's the exact time in the video (caluclated in heatmap.js)
    // Hence, we first convert t to percentage and then the rest.
   const changeMovingBar = (t) => {
        let bar = document.getElementById("movingBar");
        const svgWidth = document.getElementsByClassName("svgParent")[0].clientWidth + 0.4;
        const offsetLeft = document.getElementsByClassName("svgParent")[0].offsetLeft;
        const videoDuration = document.getElementsByTagName("video")[0].duration;
        let newValue = (parseFloat(t)/videoDuration) * svgWidth + offsetLeft;
        bar.style.left = newValue + "px";
    }
    
    const handlePlayBtn = (e) => props.playPause(e);
    // handleSpeedBtn = (e) => props.toggleSpeed(e);
    const handleReset = (e) => props.replay(e);
    const handleSeekDown = (t) => props.down(t);
    const handleSeekChange = (t) => props.change(t);
    const handleSeekHeatmapChange = (t) => {
        props.heatChange(t); // t here is the time, unlike the other t's here which are events
        changeMovingBar(t);
    }
    const handleSeekUp = (t) => props.up(t);
    const handleProgress = (t) => props.progress(t);

    const [heatmaps, setHeatMaps] = React.useState([]);
    const [data, setData] = React.useState(null);

    useEffect(fetchData, [props.videoData]);
    useEffect(updateHeatmaps, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
          if (props.playing && document.getElementsByClassName("svgParent")[0]) {
              let currentTime = document.getElementsByTagName("video")[0].currentTime;
              changeMovingBar(currentTime);
          }
        }, 999);
        return () => clearInterval(interval);
      }, []);
    function fetchData () {
        d3.csv(require(`./data/${props.videoData}`))
          .then((d) => {
              setData(d);
              console.log(d);
           })
          .catch(function(error){
            console.log(error)   
         });
    }

    function updateHeatmaps(){
        if (data && data.length) {
            const temp = data.map((item, index) => {
                let key = index + "." + props.videoData;
                return (
                    <Heatmap size={[400, 50]} data={item} key={key} title={item.componentName} type={item.Type} change={handleSeekHeatmapChange}/>
                )
            });
            setHeatMaps(temp);
            console.log(heatmaps);
        }
    }

    const legendData = [
        {value: "[0, 0.25)", backgroundColor: "#3a4cb133", color: "black", },
        {value: "[0.25, 0.5)", backgroundColor: "#ffc500", color: "black", },
        {value: "[0.5, 0.75)", backgroundColor: "#ff5727", color: "white", },
        {value: "[0.75, 1]", backgroundColor: "#c90035", color: "white", },
    ];

    const legend = legendData.map((item,index) => {
        return (
            <Grid item xs={3} container justify="center" style={{backgroundColor: item.backgroundColor, color: item.color}} key={index}>    
                <Typography variant="caption">{item.value}</Typography>
            </Grid>
        )
    })
   
    return (
        <React.Fragment>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={2}>
                    <PlayToggleButton playing={props.status.playing} onClick = {handlePlayBtn} />
                    <ResetButton onClick = {handleReset} />
                </Grid>
                <Grid item xs={9} className={classes.progressBarGrid}>
                    <ProgressBar played={props.status.played} down={handleSeekDown} change={handleSeekChange} up={handleSeekUp} progress={handleProgress}/>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" className={classes.heatmapContainer}>
                {/* Bar that's supposed to move with the progressbar */}
                <div className={clsx(classes.sliderBar, document.getElementsByTagName("main")[0] && document.getElementsByTagName("main")[0].clientWidth > 1100 ? classes.slideBarTall : classes.sliderBarShort)} 
                    id="movingBar"></div> 
                {heatmaps}
            </Grid>
            <Grid container alignItems="center" justify="center" className={classes.legendBox}>
                <Grid item xs={2}>
                    <Typography variant="caption">Color guide </Typography>
                </Grid>
                <Grid item xs={9} container>
                    {legend}
                </Grid>
            </Grid>
        </React.Fragment>
    );
}