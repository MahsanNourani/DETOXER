import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import * as d3 from 'd3';
import { Grid, Typography, withStyles} from '@material-ui/core'
import './Heatmap.css';
// import {pink} from '@material-ui/core/colors'
const margin = {top: 0, right: 0, bottom: 0, left: 0};

const styles = (theme) => ({
	// chartTitle: {
	// 	fontWeight: "bold",
	// 	color: "white",
	// 	backgroundColor: "#99aa00",
	// 	// border: "0.5px solid #f5b8cabd",
	// 	padding: "6px",
	// 	fontSize: "14px",
	// 	borderRadius: "3px",
	// 	// boxShadow: "2px 3px 7px 1px #faf0f3",
    // },
    // chartTitle: {
    //     fontSize: document.getElementById('mainDiv').style.width > 1200 ? "20px": "10px",
    // },
    body1: {
        fontSize: "0.88rem",
        lineHeight: "inherit",
    },
    caption: {
        lineHeight: "inherit",
        color: theme.palette.secondary.dark,
    },
	svg: {
        marginTop: 0.5 * theme.spacing(1),
	}
});
 
class Heatmap extends Component {
	constructor(props) {
		super(props);
		this.createHeatmaps = this.createHeatmaps.bind(this);

		const WIDTH = this.props.size[0], HEIGHT = this.props.size[1];
		this.state = {
			width: WIDTH - margin.left - margin.right,
			height: HEIGHT - margin.top - margin.bottom,
			type: this.props.type,
            title: this.props.title,
            data: this.props.data,
            colors: ["#3a4cb133", "#ffc500", "#ff5727", "#c90035"],
		}
	}
	componentDidMount() {
        this.createHeatmaps();
    }
    
    capitalizeFirstLetter (input) { 
        return input[0].toUpperCase() + input.slice(1); 
    } 

	createHeatmaps() {
        const node = this.node;
        let x = scaleLinear()
                .range([0, this.state.width]);

        let svgElement = select(node);

        const numOfNonFrameColumns = 3; // This is right now showing order, type, and componentName -- Used for determining num of columns with frames

        let numOfFrames = Object.keys(this.state.data).length - numOfNonFrameColumns;

        x.domain([0, numOfFrames]); // domain size is length of row -2 (2 is the number of textual frames)
        
        const rectWidth = this.state.width / numOfFrames; //size of the rectangle based on svg width

        let frameData = []
        for (let j = 1; j <= numOfFrames; j++) {
            frameData.push(this.state.data["Frame" + j] * 100);
        }

        let g = svgElement.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        g.selectAll('rect')
            .data(frameData).enter()
            .append('rect')
            .attr("height", this.state.height)
            .attr("width", rectWidth)
            .attr("x", (d,i) => x(i))
            .attr("class", (d,i) => {
                return "timeClass" + i;
            })
            .attr("fill", (d) => {
                // console.log("d is: " + d + " and parseInt(d)/25 % 4 is: " + parseInt(parseInt(d) / 25)%4);
                return this.state.colors[parseInt(parseInt(d) / 25)%4]
            })
            .on("mouseenter", (d,i) => {
                // console.log(this);
                d3.selectAll(`.timeClass${i}`) //d3.event.target to select this element
                    .style("opacity","40%")
                    .attr("height", `${this.state.height + 20}px`)
                    .classed('active', true);
                d3.select(`.${this.state.title.replace(/\s/g, "")}Title`)
                    .classed("titleActive", true);
            })
            .on("mouseleave", (d,i) => {
                d3.selectAll(`.timeClass${i}`) //d3.event.target to select this element
                    .style("opacity","100%")
                    .attr("height", `${this.state.height}px`)
                    .classed('active', false);
                    // .attr("fill", () => this.state.colors[parseInt(parseInt(d) / 25)%4])
                d3.select(`.${this.state.title.replace(/\s/g, "")}Title`)
                    .classed("titleActive", false);
            })
            .on("mouseup", (d,i) => {
                const videoDuration = document.getElementsByTagName("video")[0].duration;
                console.log("index = " + i + ", percentage = " + i/numOfFrames);
                console.log(videoDuration);
                let seekTime = (i/numOfFrames) * videoDuration;
                console.log("seekTime= " + seekTime);
                this.props.change(seekTime);
            })
            .exit(); //domain = 100 -- number of unique colors = 4 --> 25= 100/4
    }
    
	render() {
		const { classes } = this.props;
		return (
        <React.Fragment>
            <Grid item xs={2}>
                <Typography variant="body1" classes={{body1: classes.body1}} className={`${this.state.title.replace(/\s/g, "")}Title`} > {this.capitalizeFirstLetter(this.state.title)} </Typography>
                {/* <Typography variant="caption" classes={{caption: classes.caption}}> {this.capitalizeFirstLetter(this.state.type)} </Typography> */}
            </Grid>
            <Grid item xs={9} className="svgParent">
                {/* The width and height of the svg is passed from props and before calculating the margins of course 
                - for the rest, use the this.state.height and this.state.width */}
                <svg ref={node => this.node = node} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${this.props.size[0]} ${this.props.size[1]}`} className={classes.svg}/>
            </Grid>
        </React.Fragment>
		)
	}
}

export default withStyles(styles)(Heatmap)