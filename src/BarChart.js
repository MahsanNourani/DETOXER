import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import * as d3 from 'd3';
import { Grid, Typography, withStyles} from '@material-ui/core'
import './BarChart.css'
// import {indigo} from '@material-ui/core/colors'
const margin = {top: 20, right: 0, bottom: 70, left: 25};

const styles = {
	svg: {
		cursor: "default"
	}
 };
 
class BarChart extends Component {
	constructor(props) {
		super(props);
		this.createBarChart = this.createBarChart.bind(this);

		const WIDTH = this.props.size[0], HEIGHT = this.props.size[1];
		this.state = {
			width: WIDTH - margin.left - margin.right,
			height: HEIGHT - margin.top - margin.bottom,
			id: this.props.id,
		}
	}
	componentDidMount() {
		this.createBarChart()
	}

	createBarChart() {
		const node = this.node;
		const y = scaleLinear()
			.domain([0,100]) // domain is input bound -- if you want a constant max, use this
			/*.domain([0, d3.max(this.props.data, function (d) { 
				return Number(d.score);
			})]) */ // uncomment and replace with the previous line if you want the highest value as maximum data value
			.rangeRound([this.state.height, 0]); //output bounds

		var x = d3.scaleBand()
			.rangeRound([0, this.state.width])
			// .padding(0.1)
			.domain(this.props.data.map(d => d.object));
		
		let svgElement = select(node);
		
		let g = svgElement.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		g.append("g")
			.attr("transform", "translate(0," + this.state.height + ")")
			.classed("axisGrey xAxis", true)
			.call(d3.axisBottom(x).tickPadding([-16])) // 16 is just the padding from the axis

		g.append("g")
			.call(d3.axisLeft(y))
			.classed("yaxis axisGrey", true) // this class can be used later to customize and differentiate between yaxis and xaxis
			.attr("id", this.state.id) //this id will be used to make sure customization based on classes will only be applied to the current component
			.append("text")
			.attr("fill", "#000")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end");

		let bar = g.selectAll('.group')
			.data(this.props.data).enter()
			.append('g')
			.classed('group', true);
		
		bar.append('rect')
			.style('fill', (d, i) => {
				// // Uncomment these if you want to color based on order and not score value. Beware that same probabilites will then have diff. colors!
				// let colorValue = i / this.props.data.length;
				// return d3.interpolateRdBu(colorValue);
				return d3.interpolateCool(1-Number(d.score)/100);
			})
			.attr('x', (d) => x(d.object))
			.attr('y', d => y(Number(d.score)))
			.attr('rx','1px') //rounded border
			.attr('ry', '1px') //rounded border
			.attr('height', d => this.state.height - y(Number(d.score)))
			.attr('width', x.bandwidth())
			.classed("barChart", true)
			.on("mouseover", function() {
				d3.select(this).style("opacity", "0.7");
			})
			.on("mouseout", function() {
				d3.select(this).style("opacity", "1");
			})
		
		bar.append('text')
			.text(function (d) {
				if (d.score)
					return d.score;
			})
			.attr("dy", ".75em")
			.attr('x', (d,i) => {
				if (d.score)
					return (x.bandwidth() * (2*i + 1) - x(d.object)) - x.bandwidth()/2;
			})
			.attr('y', (d) => y(Number(d.score)) - 10) // top of the chart - some padding to not attach the number to the chart directly!
			.classed("barText", true)
		// To only show every other tick to avoid cluttering
		var yticks = d3.selectAll(`#${this.state.id}.yaxis .tick`);
		yticks.each(function(_,i){
				if(i%2 !== 0) {
					d3.select(this).remove();
				}
		});

	}
	render() {
		const { classes } = this.props;
		return (
		<Grid item xs={12} align="center">
			{/* The width and height of the svg is passed from props and before calculating the margins of course 
			- for the rest, use the this.state.height and this.state.width */}
			<svg ref={node => this.node = node} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${this.props.size[0]} ${this.props.size[1]}`} className={classes.svg}/>
		</Grid>
		)
	}
}

export default withStyles(styles)(BarChart)