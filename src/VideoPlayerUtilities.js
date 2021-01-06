import React, {useEffect} from 'react';
import {makeStyles, Grid, Typography, NativeSelect, FormControl} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import './videoPlayer.css';
import Heatmap from './Heatmap';
import Streamgraph from './Streamgraph';
import * as d3 from 'd3';
import clsx from 'clsx';

// Uncomment for sorting functionality
// import { Sort } from './Sort';
import {yellow, amber, orange, deepOrange, red, grey} from '@material-ui/core/colors'


const useStyles = makeStyles (theme => ({
    slider: {
        width: "100%",
        margin: -3,
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
    streamgraphContainer: {
        maxHeight: 300,
        overflow: "auto",
        border: "1px solid #3a4cb13d",
        borderRadius: "3px",
        position: "relative",
        overflowY: "hidden",
        marginTop: theme.spacing(1),
    },
    sliderBar: {
        backgroundColor: "#3a4cb1c9",
        width: "2px",
        position: "absolute",
        boxShadow: "0px 0px 20px 4px #afb9e0",
    },
    sliderBarStreamgraph: {
        backgroundColor: "#3a4cb1c9",
        width: "2px",
        position: "absolute",
        boxShadow: "0px 0px 20px 4px #0374ff",
    },

    sliderBarShort: {
        height: "470%",
    },
    slideBarTall: {
        height: "660%"
    },
    iconRoot: {
        padding: theme.spacing(1)/2,
    },
    legendBox: {
        marginTop: "10px",
        border: "1px solid #3a4cb194",
        borderRadius: "3px",
    },
    sortAndFilterSelect: {
        // paddingRight: "24px",
        fontSize: "14px",
        // backgroundColor: "#3a4cb1",
        // color: "white",
        // border: `1px solid ${theme.palette.primary.main}`,
        // paddingLeft: "10px",
        // borderBottomRightRadius: "3px",
        // borderBottomLeftRadius: "3px",
    },
    invisible: {
        display: "none",
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

    const changeMovingBar = (t, id, parent) => {
        let bar = document.getElementById(id);
        const svgWidth = document.getElementsByClassName(parent)[0].clientWidth + 0.4;
        const offsetLeft = document.getElementsByClassName(parent)[0].offsetLeft;

        let newValue = parseFloat(t)*svgWidth + offsetLeft;
        bar.style.left = newValue + "px";
    }
    
    const handleSeekMouseDown = e => props.down(e);
    const handleSeekChange = (e, newValue) => {
        props.change(e);
        changeMovingBar(e.target.value, "movingBarHeatmap", "svgParent");
        changeMovingBar(e.target.value, "movingBarStreamgraph", "streamDiv");
    }
    const handleSeekMouseUp = e => {
        props.up(e);
        setSliderValue(e.target.value);
        changeMovingBar(e.target.value, "movingBarHeatmap", "svgParent");
        changeMovingBar(e.target.value, "movingBarStreamgraph", "streamDiv");
    }
    return(
        <input id="progressBar" type="range" min="0" max="0.9999" step="any" value={props.played} onMouseDown={handleSeekMouseDown} 
            onChange={handleSeekChange} onMouseUp={handleSeekMouseUp} className={`${classes.slider} slider`}/>
    );
}

// export const sortFilter = (props) => {
//     const classes = useStyles();

    
// }

export const PlayerControls = (props) => {
    const classes = useStyles();
    
    // Slightly different function than the one in the previous function, because the 't' is different. 
    // In the other one, it's the clicked seek time as percentage and in this one, it's the exact time in the video (caluclated in heatmap.js)
    // Hence, we first convert t to percentage and then the rest.
   const changeMovingBar = (t, id, parent) => {
        let bar = document.getElementById(id);
        const svgWidth = document.getElementsByClassName(parent)[0].clientWidth + 0.4;
        const offsetLeft = document.getElementsByClassName(parent)[0].offsetLeft;
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
        changeMovingBar(t, "movingBarHeatmap", "svgParent");
        changeMovingBar(t, "movingBarStreamgraph", "streamDiv");
    }
    const handleSeekUp = (t) => props.up(t);
    const handleProgress = (t) => props.progress(t);

    const [heatmaps, setHeatMaps] = React.useState([]);
    const [streamgraphs, setStreamGraphs] = React.useState(null);
    const [data, setData] = React.useState(null);

    // Uncomment for sorting heatmaps
    // const [sortValue, setSort] = React.useState("default");
    // useEffect(setSort, []);

    // For the view selection
    const [viewValue, setView] = React.useState("heatmap")
    useEffect(setView, []);

    useEffect(fetchData, [props.videoData]);
    useEffect(updateHeatmaps, [data]);
    useEffect(updateStreams, [data]);

    //To move the bar with the progress bar (updates every second)
    useEffect(() => {
        const interval = setInterval(() => {
            if (props.playing && document.getElementsByClassName("svgParent")[0]) {
                let currentTime = document.getElementsByTagName("video")[0].currentTime;
                changeMovingBar(currentTime, "movingBarHeatmap", "svgParent");
            }
            if (props.playing && document.getElementsByClassName("streamDiv")[0]) {
                let currentTime = document.getElementsByTagName("video")[0].currentTime;
                changeMovingBar(currentTime, "movingBarStreamgraph", "streamDiv");
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
            const tempHeatmap = data.map((item, index) => {
                let key = index + ".hmap." + props.videoData;
                return (
                    <Heatmap size={[400, 20]} data={item} key={key} title={item.componentName} type={item.Type} order={item.Order} change={handleSeekHeatmapChange}/>
                )
            });
            setHeatMaps(tempHeatmap);
            console.log(heatmaps);
        }
    }

    function updateStreams() {
        if (data && data.length) {
            let key = data[1].componentName + '-' + data[0].Frame1 + '-' + data[1].Frame1;
            const tempStreamgraph = (<Streamgraph size={[250, 120]} streamData={data} key={key} change={handleSeekHeatmapChange}/>)
            setStreamGraphs(tempStreamgraph);
        }
    }

    // colors: ["#3a4cb133", "#ffc500", "#ff5727", "blue", "green", "#c90035"],
    // colorBoundaries: [10, 40, 60, 80, 95, 100], // percentages

    const legendData = [
        {value: "None", backgroundColor: grey[400], color: "black", xs:2}, // 0 - 10 %
        {value: "Low", backgroundColor: yellow[500], color: "black", xs:2}, // 10 - 40 %
        {value: "Maybe", backgroundColor: amber[500], color: "black", xs:2}, // 40 - 60 %
        {value: "Likely", backgroundColor: orange[500], color: "black", xs:2}, // 60 - 80 %
        {value: "High", backgroundColor: deepOrange[500], color: "white", xs:2}, // 80 - 95 %
        {value: "Certain", backgroundColor: red[900], color: "white", xs:2}, // 95 - 100 %
    ];

    const legend = legendData.map((item,index) => {
        return (
            <Grid item xs={item.xs} container justify="center" style={{backgroundColor: item.backgroundColor, color: item.color}} key={index}>    
                <Typography variant="caption">{item.value}</Typography>
            </Grid>
        )
    })
   
    // Uncomment for sorting the heatmaps
    // const handleSortChange = e => {
    //     setSort(e.target.value);
    // }
    // const sortSelect = 
    //         <FormControl className={classes.formControl}>
    //             {/* <InputLabel htmlFor="sort">Sort</InputLabel> */}
    //             <NativeSelect variant="standard" value={sortValue} onChange={handleSortChange} 
    //                           className={classes.sortAndFilterSelect} inputProps={{name: 'sort', id: 'sort',}}>
    //                 {/* <option aria-label="None" value=""/> */}
    //                 <option value="type">Type</option>
    //                 <option value="title">Name</option>
    //                 <option value="default">Relevance</option> 
    //             </NativeSelect>
    //             {/* <FormHelperText>Sort</FormHelperText> */}
    //         </FormControl>

    const handleViewChange = e => {
        setView(e.target.value);
    }
    const viewSelect = 
            <FormControl className={classes.formControl}>
                <NativeSelect variant="standard" value={viewValue} onChange={handleViewChange} 
                              className={classes.sortAndFilterSelect} inputProps={{name: 'view', id: 'view',}}>
                    <option value="heatmap">Component-specific Overview</option>
                    <option value="streamgraph">Comparison-based Overview</option>
                </NativeSelect>
            </FormControl>

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
            {/* Uncomment for sorting selection */}
            {/* <Grid container>
                <Grid item>
                    {sortSelect}
                </Grid>
            </Grid> */}
            <Grid container>
                <Grid item>
                    {viewSelect}
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" className={clsx(classes.heatmapContainer, viewValue == "streamgraph"? classes.invisible : "")}>
                {/* Bar that's supposed to move with the progressbar */}
                <div className={clsx(classes.sliderBar, document.getElementsByTagName("main")[0] && document.getElementsByTagName("main")[0].clientWidth > 1100 ? classes.slideBarTall : classes.sliderBarShort)} 
                    id="movingBarHeatmap"></div> 
                {/* Uncomment for sorting the heatmaps + uncomment above */}
                {/* <Sort by={sortValue}>  */}
                {heatmaps}
                {/* </Sort> */}
            </Grid>
            <Grid container alignItems="center" justify="center" className={clsx(classes.legendBox, viewValue == "streamgraph"? classes.invisible:"")}>
                {/* <Grid item xs={3}>
                    {sortSelect}
                </Grid> */}
                <Grid item xs={2}>
                    <Typography variant="caption">Detection Conf.</Typography>
                </Grid>
                <Grid item xs={9} container>
                    {legend}
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" className={clsx(`${classes.streamgraphContainer} streamgraphMainDiv`, viewValue == "heatmap"? classes.invisible: viewValue == undefined ? classes.invisible: "")}>
                <div className={clsx(classes.sliderBarStreamgraph, document.getElementsByTagName("main")[0] && document.getElementsByTagName("main")[0].clientWidth > 1100 ? classes.slideBarTall : classes.sliderBarShort)} 
                        id="movingBarStreamgraph"></div> 
                {streamgraphs}
            </Grid>
        </React.Fragment>
    );
}