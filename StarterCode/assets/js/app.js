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

// Access data from csv and load in. Create then function
d3.csv("assets/data/data.csv").then(function(stateData){
    console.log(stateData);

    stateData.forEach(function(d){
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Create band scale for horizontal and vertical axes
    var xScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=>d.poverty)-1, d3.max(stateData, d => d.poverty)+1])
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


    // Append text to circles on chart
    var circlesText = chartGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .attr("dx", d => xScale(d.poverty))
        .attr("dy", d => yScale(d.healthcare))
        .text(d => (d.abbr))
        .classed("stateText", true)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central");
    

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .classed("active", true)
        .text("In Poverty (%)");
        
      
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0-height/2)
        .attr("y", 0-margin.left)
        .attr("dy", "1em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
        
    
    // // Now render the SVG scene, connecting the tool tip to each circle.
    // var circles = svg.selectAll("circle").data(radii);
    // circles.enter().append("circle")
    //   .attr("r", function(d) { return d; })
    //   .attr("cx", function(d, i) { return 50 + 50*i; })
    //   .attr("cy", function(d, i) { return 50 + 50*i; })
    //   .style("fill", "red")
    //   .style("stroke", "black")
    //   .on('mouseover', tool_tip.show)
    //   .on('mouseout', tool_tip.hide);

    // //         // Setup the tool tip.  Note that this is just one example, and that many styling options are available.
//     // See original documentation for more details on styling: http://labratrevenge.com/d3-tip/
// var tool_tip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([-8,0])
//     .html(function(d) { 
//         return (`<strong>${d.state},${d.abbr}</strong><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
//     });    
// circlesGroup.call(tool_tip);
// circlesGroup.on("mouseover", function(stateData){
//     toolTip.show(data, this);
//     d3.select(this).style("stroke", "black");
// });
// circlesGroup.on("mouseout", function(data, index){
//     toolTip.hide(data, this)
//     d3.select(this).style("stroke", "white");
// });
// return circlesGroup;

//     // Initialize Tool Tip
// var toolTip = d3.tip()
//     .attr("class", "tooltip d3-tip")
//     .offset([90, 90])
//     .html(function(d) {
//         return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
//     });
//     // Create Circles Tooltip in the Chart
// circlesGroup.call(toolTip);
//     // Create Event Listeners to Display and Hide the Circles Tooltip
// circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data, this);
// })
//       // onmouseout Event
//     .on("mouseout", function(data) {
//         toolTip.hide(data);
//     });
//     // Create Text Tooltip in the Chart
//     textGroup.call(toolTip);
//     // Create Event Listeners to Display and Hide the Text Tooltip
//     textGroup.on("mouseover", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout Event
//     .on("mouseout", function(data) {
//         toolTip.hide(data);
//     });
//     return circlesGroup;
// }



}
, function(error) {
  console.log(error);
});
