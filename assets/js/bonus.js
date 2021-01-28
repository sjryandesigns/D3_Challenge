// @TODO: YOUR CODE HERE!

// Define SVG area
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
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
function xScale(stateData, selectedXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=>d[selectedXAxis])*0.9, d3.max(stateData, d => d[selectedXAxis])*1.1])
        .range([0, width]);
    return xLinearScale;
};

function yScale(stateData, selectedYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d=>d[selectedYAxis])-1, d3.max(stateData, d => d[selectedYAxis])+1])
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

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

// Create function to update circle group with transitions
function updateCirclesx(circlesGroup, newXScale, selectedXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[selectedXAxis]))
    return circlesGroup;
};

function updateCirclesy(circlesGroup, newYScale, selectedYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[selectedYAxis]));
    return circlesGroup;
};



// Create function to update circle labels with transitions
function updateLabelsx(circlesGroup, newXScale, selectedXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[selectedXAxis]))
    return circlesGroup;
};

function updateLabelsy(circlesGroup, newYScale, selectedYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[selectedYAxis]));
    return circlesGroup;
};


// // Create function to circle group with new tooltips
function updateToolTips(circlesGroup, selectedXAxis, selectedYAxis){
    let xpercentsign = "";
    let xlabel = "";
    if (selectedXAxis === "poverty"){
        xlabel = "Poverty";
        xpercentsign = "%";
    }
    else if (selectedXAxis === "age"){
        xlabel = "Age";
    }
    else {
        xlabel = "Income";
    }
    
    let ypercentsign = "";
    let ylabel = "";
    if (selectedYAxis === "healthcare"){
        ylabel = "Healthcare";
        ypercentsign = "%";
    }
    else if (selectedYAxis === "smokes"){
        ylabel = "Smokes";
        ypercentsign = "%";
    }
    else {
        ylabel = "Obesity";
        ypercentsign = "%";
    }

    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -75])
    .html(d => {
        return (`${d.state}, ${d.abbr} <br>${ylabel} ${d[selectedYAxis]} <br> ${xlabel} ${d[selectedXAxis]}`)
        });
    

    circlesGroup.call(toolTip);

  // mouseover event
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    // onmouseout event
        .on("mouseout", function(data) {
            toolTip.hide(data, this);
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

    // Initialize scale functions for horizontal and vertical axes
    var xLinearScale = xScale(stateData, selectedXAxis);
    var yLinearScale = yScale(stateData, selectedYAxis);


    // Initialize functions and pass scales as arguments to create chart axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append group elements to chartGroup area and create x and y axes 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Create scatterplot and append initial circles
    var circlesGroup = chartGroup.selectAll("g circle")
        .data(stateData)
        .enter()
        .append("g");

    var circlesXY = circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d[selectedXAxis]))
        .attr("cy", d => yLinearScale(d[selectedYAxis]))
        .attr("r", 15)
        .classed("stateCircle", true);
    
    // Append circles text
    var circleLabels = circlesGroup.append("text")
        .classed ("stateText", true)
        .attr("x", d => xLinearScale(d[selectedXAxis]))
        .attr("y", d => yLinearScale(d[selectedYAxis]))
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central");

    // Create groups for x and y axes labels    
    // Append text for axes to chart
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
    
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")  

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x", -(height/2))
        .attr("y", -40)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("x", -(height/2))
        .attr("y", -60)
        .attr("value", "obesity")
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Obese (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", -(height/2))
        .attr("y", -80)
        .attr("value", "smokes")
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Smokers (%)");
    
    // Initialize tooltips 
    var circlesGroup = updateToolTips(circlesGroup, selectedXAxis, selectedYAxis);

    // X axis label event listener
    xLabelsGroup.selectAll("text")
        .on("click", function(){
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== selectedXAxis){
                // replaces selected x axis with value
                selectedXAxis = value;
                // Update x scale for new data
                xLinearScale = xScale(stateData, selectedXAxis);
                // Update x axis withi transition
                xAxis = updateXAxis(xLinearScale, xAxis);
                // Update circles, circle text with new x values ; tooltips with new info
                circlesXY = updateCirclesx(circlesXY, xLinearScale, selectedXAxis);
                circlesGroup = updateToolTips(circlesGroup, selectedXAxis, selectedYAxis);
                circleLabels = updateLabelsx(circleLabels, xLinearScale, selectedXAxis);
                // Change class to style label text
                if (selectedXAxis === "income"){
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);    
                }
                else if (selectedXAxis === "age"){
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true); 
                }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
    // Y axis label event listener
    yLabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== selectedYAxis){
                selectedYAxis = value;
                yLinearScale = yScale(stateData, selectedYAxis);
                yAxis = updateYAxis(yLinearScale, yAxis);
                circlesXY = updateCirclesy(circlesXY, yLinearScale, selectedYAxis);
                circlesGroup = updateToolTips(circlesGroup, selectedXAxis, selectedYAxis);
                circleLabels = updateLabelsy(circleLabels, yLinearScale, selectedYAxis);

                if (selectedYAxis === "smokes"){
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);    
                }
                else if (selectedYAxis === "obesity"){
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true); 
                }
                else {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}
// Error function
, function(error) {
  console.log(error);
});
