// @TODO: YOUR CODE HERE!

// Define SVG area
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
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
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .classed("chart", true);

// Set initial selections for axes
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";

// Create functions for updating x and yscales when axis selected
function xScale(data, selectedXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d[selectedXAxis])-1, d3.max(data, d => d[selectedXAxis])+1])
        .range([0, width]);
    return xLinearScale;
};

function yScale(data, selectedYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d[selectedYAxis])-1, d3.max(data, d => d[selectedYAxis])+1])
        .range([height, 0]);
    return yLinearScale;
};

// Create functions for updating axes variables when axis selected
function updateXAxis (newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};

function updateYAxis (newXScale, yAxis) {
    var leftAxis = d3.axisLeft(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};



















// // Access data from csv and load in. Create then function
// d3.csv("assets/data/data.csv").then(function(stateData){
//     console.log(stateData);

//     stateData.forEach(function(d){
//         d.poverty = +d.poverty;
//         d.healthcare = +d.healthcare;
//         d.abbr = d.abbr;
//     });

//     // Create band scale for horizontal and vertical axes
//     var xScale = d3.scaleLinear()
//         .domain([d3.min(stateData, d=>d.poverty)-1, d3.max(stateData, d => d.poverty)+1])
//         .range([0, width]);

//     var yScale = d3.scaleLinear()
//         .domain([d3.min(stateData, d=>d.healthcare)-1, d3.max(stateData, d => d.healthcare)+1])
//         .range([height, 0]);

//     // Create functions and pass scales as arguments to create chart axes
//     var bottomAxis = d3.axisBottom(xScale);
//     var leftAxis = d3.axisLeft(yScale);

//     // Append group elements to chartGroup area and create axes 
//     chartGroup.append("g")
//         .call(leftAxis);

//     chartGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);

//     // Append circles to chart
//     var circlesGroup = chartGroup.selectAll("circle")
//         .data(stateData)
//         .enter()
//         .append("circle")
//         .attr("cx", d => xScale(d.poverty))
//         .attr("cy", d => yScale(d.healthcare))
//         .attr("r", 15)
//         .classed("stateCircle", true);

//     // Append text to circles on chart
//     var circlesText = chartGroup.selectAll(".stateText")
//         .data(stateData)
//         .enter()
//         .append("text")
//         .classed("stateText", true)
//         .attr("x", d => xScale(d.poverty))
//         .attr("y", d => yScale(d.healthcare))
//         .text(d => (d.abbr))
//         .attr("text-anchor", "middle")
//         .attr("alignment-baseline", "central");
    
//     // Append text for axes to chart
//     chartGroup.append("text")
//         .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
//         .classed("aText", true)
//         .classed("active", true)
//         .text("In Poverty (%)");
        
      
//     chartGroup.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 0-height/2)
//         .attr("y", 0-margin.left)
//         .attr("dy", "1em")
//         .classed("aText", true)
//         .classed("active", true)
//         .text("Lacks Healthcare (%)");


//     // Add tooltip using d3-tip
//     var toolTip = d3.tip()
//         .attr("class", "d3-tip")
//         .offset([80, -60])
//         .html(function(d){
//             return (`${d.state}, ${d.abbr} <br>Poverty: ${d.poverty}% <br>Healthcare: ${d.healthcare}%`);
//         });
//     chartGroup.call(toolTip);

//     // Create events for mouse over and mouse out for tool tips
//     circlesGroup.on("mouseover", function(d){
//         toolTip.show(d,this);
//     })

//         .on("mouseout", function(d){
//             toolTip.hide(d);
//         });

//     circlesText.on("mouseover", function(d){
//         toolTip.show(d,this);
//     })
    
//         .on("mouseout", function(d){
//             toolTip.hide(d);
//         });
// }
// // Error function
// , function(error) {
//   console.log(error);
// });
