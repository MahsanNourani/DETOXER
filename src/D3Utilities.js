import React from 'react';
import * as d3 from 'd3';

export const Barchart = (props) => {
    let svgContainer = d3.append("div")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 300 300")
        .classed("svg-content", true)
        .fill("red");

    return (
        {svgContainer}
    );
}