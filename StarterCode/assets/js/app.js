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
        .domain([d3.min(stateData, d=>d.poverty)*0.9, d3.max(stateData, d => d.poverty)*1.1])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=>d.healthcare)-1, d3.max(stateData, d => d.healthcare)+1])
        .range([height, 0]);

    // Create functions and pass scales as arguments to create chart axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Append group elements to chartGroup area and create axes 
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append circles to chart
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 15)
        .classed("stateCircle", true);

        

}
, function(error) {
  console.log(error);
});