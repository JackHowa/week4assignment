// 1. 
// In this "var margin" graph, it seems like I'm 
// designating where the .chart is going to be. 
// Because when I changed to .chart from something else, 
// it put the thing in the body, not the footer. 

// It gets used in the css. We have a style .chart. 
// In addition, it gets used to make stuff later in script. 

// It affects the scene I'm creating something in. 
// When I change margins, it messes up space around scene too. 

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

// 2. 
// x is the scale, from center, of the d3 thingy. 
// Because if you raise ([0, width].1) -> ([0, width]10*), 
// it condenses the bar graph scale within the "var margin" scene. 
// Oddly, increasing it shrinks the discrete scale. 
// The bands padding is also messed up when this happens. 

// Turns out, making the .1->10 change grew the bars so much,
// it probably didn't appear on page. 
// Because, without it, the bars are all together 
// - no space in between.
// href https://github.com/mbostock/d3/wiki/Ordinal-Scales

// On the other hand (or axis), there isn't padding. 
// The y axis scale is linear, not ordinal. 
// Therefore, it's a quantitate scale that's for numbers. 
// And so that padding doesn't make a difference,
// nor does the fact that the #s are continuous 
// - not discrete - variables. 
// href https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// 3. 
// x axis are drawn using d3's axis component. 
// 

// href https://github.com/mbostock/d3/wiki/SVG-Axes 

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d;
      });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("js/baseballcard.json", function(error, data) {
  x.domain(data.stats.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data.stats, function(d) { return d.H; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Hits");

  svg.selectAll(".bar")
      .data(data.stats)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.H); })
      .attr("height", function(d) { return height - y(d.H); });

});




