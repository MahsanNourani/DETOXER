import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import * as d3 from 'd3';
import { Grid, Typography, withStyles} from '@material-ui/core'
import './Heatmap.css'
// import {pink} from '@material-ui/core/colors'
const margin = {top: 0, right: 0, bottom: 0, left: 0};

const styles = {
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
	svg: {
        marginTop: 10,
	}
 };
 
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
            colors: ["#3a4cb133", "#c90035", "#ff5727", "#ffc500"],
		}
	}
	componentDidMount() {
        this.createHeatmaps();
	}

	createHeatmaps() {
        const node = this.node;
        let x = scaleLinear()
                .rangeRound([0, this.state.width]);

        let svgElement = select(node);

        let numOfFrames = Object.keys(this.state.data).length -2;

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
            .attr("fill", (d) => {
                // console.log("d is: " + d + " and parseInt(d)/25 % 4 is: " + parseInt(parseInt(d) / 25)%4);
                return this.state.colors[parseInt(parseInt(d) / 25)%4]
            })
            .exit(); //domain = 100 -- number of unique colors = 4 --> 25= 100/4
    }
    
	render() {
		const { classes } = this.props;
		return (
        <React.Fragment>
            <Grid item xs={2}>
                <Typography variant="body1" className={classes.chartTitle}> {this.state.title} </Typography>
            </Grid>
            <Grid item xs={9}>
                {/* The width and height of the svg is passed from props and before calculating the margins of course 
                - for the rest, use the this.state.height and this.state.width */}
                <svg ref={node => this.node = node} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${this.props.size[0]} ${this.props.size[1]}`} className={classes.svg}/>
            </Grid>
        </React.Fragment>
		)
	}
}

export default withStyles(styles)(Heatmap)