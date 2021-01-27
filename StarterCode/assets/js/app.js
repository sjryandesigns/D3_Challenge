// @TODO: YOUR CODE HERE!

// Define SVG area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append svg and group
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Access data from csv and load in. Create then function
d3.csv("assets/data/data.csv").then(function(stateData){
    console.log(stateData);

    stateData.forEach(function(d){
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Create band scale for horizontal and vertical axes
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.poverty])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

});