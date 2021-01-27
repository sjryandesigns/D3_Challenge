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

function updateYAxis (newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

// Create function to update circle group with transitions
function updateCircles(circlesGroup, newXScale, selectedXAxis, newYScale, selectedYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx" d => newXScale(d[selectedXAxis]))
        .attr("cy" d => newYScale(d[selectedYAxis]));
    return circlesGroup;
};

// Create function to update circle labels with transitions
function updateLabels(circleLabels, newXScale, selectedXAxis, newYScale, selectedYAxis){
    circleLabels.transition()
        .duration(1000)
        .attr("x" d => newXScale(d[selectedXAxis]))
        .attr("y" d => newYScale(d[selectedYAxis]));
    return circleLabels;
};

// Create function to circle group with new tooltips
function updateToolTips (circlesGroup, selectedXAxis, selectedYAxis){
    if (selectedXAxis === "poverty"){
        var xlabel = "In Poverty (%): ";
    }
    else if (selectedXAxis) === "age"){
        var xlabel = "Age (Median): ";
    }
    else{
        var xlabel = "Household Income (Median): $";
    };

    if (selectedYAxis === "healthcare"){
        var xlabel = "Lacks Healthcare (%): ";
    }
    else if (selectedYAxis) === "obesity"){
        var xlabelk = "Obese (%): ";
    }
    else{
        var xlabel = "Smokers (%): ";
    }; 

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(d => {
            return (`${d.state}, ${d.abbr} <br>${ylabel} ${d[selectedYAxis]} <br> ${xlabel} ${d[selectedXAxis]}`);
        });

    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })

        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });
    return circlesGroup;

};

// Access data from csv and load in. Create then function
d3.csv("assets/data/data.csv").then(function(stateData){
    console.log(stateData);

    stateData.forEach(function(d){
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.healthcare = +d.healthcare;
        d.smokes = +d.smokes;
        d.obesity = +d.obesity;
        d.abbr = d.abbr;

    });

    // Create band scale for horizontal and vertical axes
    var xLinearScale = xScale(stateData, selectedXAxis);
    
    var yLinearScale = yScale(stateData, selectedYAxis);


    // Create functions and pass scales as arguments to create chart axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append group elements to chartGroup area and create axes 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


    var gGroup = chartGroup.selectAll("g")
        .data(stateData)
        .enter()
        .append("g")
        .classed("circles", true)

    // Append circles to chart
    var circlesGroup = gGroup.append("circle")
        .data(stateData)
        // .enter()
        .attr("cx", d => xLinearScale(d[selectedXAxis]))
        .attr("cy", d => yLinearScale(d.[selectedYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);

    // Append text to circles on chart
    var circleLabels = chartGroup.selectAll(".circles")
        // .data(stateData)
        // .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[selectedXAxis]))
        .attr("y", d => yLinearScale(d.[selectedYAxis]))
        .text(d => (d.abbr))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central");
    
    // Append text for axes to chart
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top+20})`)
        // .classed("aText", true)
        // .classed("active", true)
        // .text("In Poverty (%)");
    
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 55)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")  

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", 0-height/2)
        .attr("y", 0-margin.left/3)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("x", 0-height/2)
        .attr("y", 0-margin.left/3)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", 0-height/2)
        .attr("y", 0-margin.left/3)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokers (%)");




 
}
// Error function
, function(error) {
  console.log(error);
});
