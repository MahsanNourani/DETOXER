import React, { Component } from 'react'
import './App.css'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { select } from 'd3-selection'
import * as d3 from 'd3';
import { Grid, Typography, withStyles} from '@material-ui/core'
// import './Heatmap.css';
// import {pink} from '@material-ui/core/colors'

const margin = {top: 0, right: 0, bottom: 0, left: 0};

const styles = (theme) => ({
    body1: {
        fontSize: "0.9rem",
        lineHeight: "inherit",
    },
    caption: {
        lineHeight: "inherit",
        color: theme.palette.secondary.dark,
    },
	svg: {
        // marginTop: 10,
	}
});
 
class Streamgraph extends Component {
	constructor(props) {
		super(props);
		this.createStreamgraphs = this.createStreamgraphs.bind(this);

		const WIDTH = this.props.size[0], HEIGHT = this.props.size[1];
		this.state = {
			width: WIDTH - margin.left - margin.right,
			height: HEIGHT - margin.top - margin.bottom,
            data: this.props.streamData,
            streamOffset: d3.stackOffsetNone,
            streamOrder: d3.stackOrderNone,
            streamAreaCurve: d3.curveStep,
		}
	}
	componentDidMount() {
        this.createStreamgraphs();
    }

	createStreamgraphs() {
        const node = this.node;
        let svg = select(node);

        let x = d3.scaleLinear()
            .range([0, this.state.width]);

        let y = d3.scaleLinear()
            .range([this.state.height, 0]);

        var z = d3.scaleSequential().domain([0, 30])
            .interpolator(d3.interpolateRainbow);

        let capitalizeFirstLetter = (input) => { 
                return input[0].toUpperCase() + input.slice(1); 
            }

        // var xAxis = d3.axisBottom(x)
        // 	// .ticks(d3.time.weeks);

        // var yAxis = d3.axisRight(y)

        // var yAxisr = d3.axisLeft(y)

        // var svg = d3.select(".chart").append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.append("rect")
            .attr("width", this.state.width + margin.left + margin.right)
            .attr("height", this.state.height + margin.top + margin.bottom)
            .attr("fill", "#f0f3ff");

        let frameData = []
        let keys = []

        const numOfNonFrameColumns = 3; // This is right now showing order, type, and componentName -- Used for determining num of columns with frames
        let numOfFrames = Object.keys(this.state.data[0]).length - numOfNonFrameColumns;

        const probabilityBuckets = [0.05, 0.25, 0.5, 0.75, 0.85, 0.95];

        for (let j = 1; j <= numOfFrames; j++) {
            let tempObject = {};
            tempObject.x = j;
            for (let i = 0; i < this.state.data.length; i++) {
                let probValue = +this.state.data[i]["Frame" + j]
                
                // comment this if-else statement for actual data, uncomment for rounding the probs based on the buckets 
                // even with rounding, hovering shows the exact probabilities
                if (probValue <= 0.05)
                    probValue = 0;
                else if (probValue >= 0.95)
                    probValue = 1;
                else {
                    for (let k = 1; k < probabilityBuckets.length; k++) {
                        if (probValue >= probabilityBuckets[k-1] && probValue < probabilityBuckets[k]) {
                            probValue = probabilityBuckets[k-1];
                            break;
                        }
                    }
                }

                tempObject[this.state.data[i].componentName] = probValue;
            }

            frameData.push(tempObject);
        }

        for (let i = 0; i < this.state.data.length; i++) {
            keys.push(this.state.data[i].componentName)
        }

        var stack = d3.stack()
            .keys(keys)
            .offset(this.state.streamOffset) //Silhouette
            .order(this.state.streamOrder); //stackOrderDescending

        var area = d3.area()
            .curve(this.state.streamAreaCurve)
            .x(function (d) { return x(d.data.x); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); });

        let layers = stack(frameData);

        x.domain([1, numOfFrames]); // domain size is length of row -2 (2 is the number of textual frames)
        y.domain([
            d3.min(layers, l => d3.min(l, d => d[0])),
            d3.max(layers, l => d3.max(l, d => d[1]))
        ]);

        let isPathSelected = false;
        let currentSelected = undefined;

        svg.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function (d) { return area(d); })
            .style("fill", function (d, i) { return z(i); })
            .on("mouseup", function() {
                if (isPathSelected && currentSelected == this) {
                    isPathSelected = false;
                    currentSelected = undefined;
                    d3.select(this).attr("opacity", 0.7);
                }
                else if (isPathSelected && currentSelected != this) {       
                    d3.select(currentSelected).attr("opacity", 0.3);
                    currentSelected = this;
                    d3.select(this).attr("opacity", 1);

                }
                else {
                    isPathSelected = true;
                    currentSelected = this;
                    d3.select(this).attr("opacity", 1);
                }
            })


        // svg.append("g")
        //  .attr("class", "x axis")
        //  .attr("transform", "translate(0," + this.state.height + ")")
        //  .call(xAxis);

        // svg.append("g")
        //  .attr("class", "y axis")
        //  .attr("transform", "translate(" + this.state.width + ", 0)")
        //  .call(yAxisr);

        // svg.append("g")
        //  .attr("class", "y axis")
        //  .call(yAxis);

        svg.selectAll(".layer")
            .attr("opacity", 0.7)
            .on("mouseover", function (d, i) {
                if (!isPathSelected)
                    svg.selectAll(".layer").transition()
                        .duration(250)
                        .attr("opacity", function (d, j) {
                            return j != i ? 0.3 : 1;
                        })
            })

            // .on("click", (d,i) => {
            // 	svg.selectAll(".layer")
            // 		.attr("opacity", function(d, j) {
            // 			return j != i ? 0.4 : 1;
            // 		});
            // 	d3.select(this)
            // 		.attr("stroke", "black")
            // 		.attr("stroke-width", "0.5px");
            // 	tooltip.html( "<p>" + d.key + "</p>" ).style("visibility", "visible");

            // })

            .on("mousemove", function (d, i) {
                let mousex = d3.mouse(this);
                mousex = mousex[0] - 1;
                let invertedx = Math.round(x.invert(mousex));

                let currentValue = d[invertedx];
                if (!isPathSelected) {
                    d3.select(this)
                        .classed("hover", true)
                        .attr("stroke", "#565656")
                        .attr("stroke-width", "0.2px")

                    if (currentValue) {
                        // tooltip.html("<p>" + d.key + "<br>" + Math.abs(currentValue[0] - currentValue[1]) + "</p>").style("visibility", "visible");
                        d3.selectAll(".streamSelected")
                            .html(capitalizeFirstLetter(d.key));
                        // let probability = Math.abs(currentValue[0] - currentValue[1]);
                        let probability = currentValue.data[d.key];
                        // console.log("probability: " + probability + " , my way: ", currentValue.data[d.key]);
                        d3.selectAll(".probSelected")
                            .html(probability.toFixed(2))
                            // (Math.round(num * 100) / 100).toFixed(2);

                    }
                }

            })
            .on("mouseout", function (d, i) {
                let mousex = d3.mouse(this);
                mousex = mousex[0] - 1;
                let invertedx = Math.round(x.invert(mousex));

                let currentValue = d[invertedx];

                if (!isPathSelected) {
                    svg.selectAll(".layer")
                        .transition()
                        .duration(250)
                        .attr("opacity", "0.7");

                    d3.select(this)
                        .classed("hover", false)
                        .attr("stroke-width", "0px");
                    if (currentValue) {
                        d3.selectAll(".streamSelected")
                            .html("");
                        d3.selectAll(".probSelected")
                            .html("")
                    }
                }
            })
            .exit()


        var vertical = d3.select(".streamDiv")
            .append("div")
            // .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "2px")
            .style("height", "100%")
            .style("top", "0px")
            // .style("bottom", "30px")
            .style("left", "120px")
            .style("background", "white");

        d3.select(".streamDiv")
            .on("mousemove", () => {
                let mousex = d3.event.pageX;
                // let parentElement = d3.selectAll('.streamDiv').style("width");
                // parentElement.replace("px", "");
                // parentElement = parseFloat(parentElement);

                // let barPosition = mousex - parentElement + 5;
                
                // if (barPosition < parentElement*0.28) {
                //     barPosition = parentElement*0.28;
                // }
                // if (mousex < parentElement)
                //     barPosition = mousex;
                let leftOffset = document.getElementsByClassName("streamgraphMainDiv")[0].offsetLeft;
                mousex = mousex - leftOffset + 1
                vertical.style("left", mousex + "px")
            })
            .on("mouseover", () => {
                let mousex = d3.event.pageX;
                let leftOffset = document.getElementsByClassName("streamgraphMainDiv")[0].offsetLeft;
                mousex = mousex - leftOffset + 1
                vertical.style("left", mousex + "px")
            })
            .on("mouseup", (d,i) => {
                const videoDuration = document.getElementsByTagName("video")[0].duration;
                let parentElement = d3.selectAll('.streamSvg').style("width");
                parentElement.replace("px", "");
                parentElement = parseFloat(parentElement);

                let mousex = d3.event.pageX;
                let leftOffsetDiv = document.getElementsByClassName("streamgraphMainDiv")[0].offsetLeft;
                let leftOffsetSvg = document.getElementsByClassName("streamDiv")[0].offsetLeft;
                
                // console.log("leftOffsetDiv = " + leftOffsetDiv + ", leftOffsetSvg = " + leftOffsetSvg);

                mousex = mousex - leftOffsetDiv - leftOffsetSvg + 1;

                // parentElement += leftOffset;

                // console.log("mousex = " + mousex + ", parent = " + parentElement);
                // console.log(videoDuration);
                let seekTime = (mousex/parentElement) * videoDuration;
                // console.log("seekTime= " + seekTime);
                this.props.change(seekTime);
            })
    };

	render() {
		const { classes } = this.props;
		return (
        <React.Fragment>
            <Grid item xs={2}>
                <Typography variant="body1" classes={{body1: classes.body1}} className={'streamSelected'} id="streamSelected"></Typography>
                <Typography variant="caption" classes={{caption: classes.caption}} className={'probSelected'} id="probSelected"></Typography>
            </Grid>
            <Grid item xs={9} className="streamDiv" >
                {/* The width and height of the svg is passed from props and before calculating the margins of course 
                - for the rest, use the this.state.height and this.state.width */}
                <svg ref={node => this.node = node} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${this.props.size[0]} ${this.props.size[1]}`} className="streamSvg"/>
            </Grid>
        </React.Fragment>
		)
	}
}

export default withStyles(styles)(Streamgraph)