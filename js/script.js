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
// via https://github.com/mbostock/d3/wiki/Ordinal-Scales

// On the other hand (or axis), there isn't padding. 
// The y axis scale is linear, not ordinal. 
// Therefore, it's a quantitate scale that's for numbers. 
// And so that padding doesn't make a difference,
// nor does the fact that the #s are continuous 
// - not discrete - variables. 
// via https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// 3. 
// x axis are drawn using d3's axis component. 
// The component is told to draw at the bottom, 
// or oriented. While the bottom doesn't have ticks
// or anything else, the y axis is drawn using a similar thing. 


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// But the ticks are numbered not based on really the data, even 
// though it was in the model. The orient is affected by the domain 
// path, or scene, essentially. The automatic tick generator was modified 
// by the ticks line. At the same time, the ticks are also determined 
// by the d that comes from data.stats.map. 
// via https://github.com/mbostock/d3/wiki/SVG-Axes 

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d;
      });

// 4. 
// The .chart appears in the main body of the webpage 
// unlike the default in the footer. 
// By appending the info there, each new namespace is added 
// for the data within the appended area. 
// That area was determined earlier when width and height 
// were set like a scene to place stuff in. 
// via https://github.com/mbostock/d3/wiki/Selections#append 

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("js/baseballcard.json", function(error, data) {

// 5. 
// So we have a scene to place everything in, 
// and this is telling d3 what stuff to put inside. 
// In this example, year becomes d. Then, 
// d is used to return the H data. 
// In addition, the domain function gets the max and min 
// values to place inside that scene 
// via http://www.d3noob.org/2012/12/setting-scales-domains-and-ranges-in.html
 
  x.domain(data.stats.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data.stats, function(d) { return d.H; })]);

// 6. 
// It seems like the height is being determined by g of x axis.
// Transform is "to define a new coordinate system for a set of SVG elements by applying
// applying a transformation to each coordinate specified in this set of SVG elements"
// In other words, that particular variable moves everything else. 
// via https://www.dashingd3js.com/svg-basic-shapes-and-d3js
// via https://www.dashingd3js.com/svg-group-element-and-d3js 
  
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

// 7. 
// The d3.selectAll mathod uses a selector string (.bar) to get 
// selection showing all elements matching .bar. 
// The x and y axises return their data too. 
// via http://bost.ocks.org/mike/circles/ 

// I'm not sure if it's iterating through all data, 
// or if that already happened. Because it looks like 
// that array below was/wasn't truly iterating. 
// via http://stackoverflow.com/questions/21733536/d3-js-how-can-i-iterate-through-subarrays-in-my-dataset 

// The $.each() requires more HTML elements and a d. 
// D3's iteration seems like it requires fewer 
// moving parts in a sense. 
// via http://stackoverflow.com/questions/13465796/d3-javascript-difference-between-foreach-and-each
  svg.selectAll(".bar")
      .data(data.stats)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.H); })
      .attr("height", function(d) { return height - y(d.H); });

});




