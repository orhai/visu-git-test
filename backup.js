// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
// var parseDate3 = d3.time.format("%Y-%m-%d").parse;
var parseDate3 = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x3 = d3.time.scale().range([0, width]);
var y3 = d3.scale.linear().range([height, 0]);



// Define the axes
var xAxis = d3.svg.axis().scale(x3)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y3)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// Define the line2
var valueline2 = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.open); });

var tempCrimesCorrelation = {};
var crimesCorrelationJSON = [];
var getValuesOfTwoCrimeTypes = function (crime , crimeType1 , crimeType2, wardNumber) {
    tempCrimesCorrelation = {};
    crimesCorrelationJSON = [];
    var month_day = "";
    for (var i = 0; i < crime.length; i++) {
        if(wardNumber == "ALL"){
            if(crimeType1 == crime[i][13]){
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][0]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [1,0];
                }
            }
            else if(crimeType2 == crime[i][13]){
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][1]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [0,1];
                }
            }
        }
        else if(wardNumber != "ALL"){
            if(crimeType1 == crime[i][13] && wardNumber == crime[i][20]){
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][0]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [1,0];
                }
            }
            else if(crimeType2 == crime[i][13] && wardNumber == crime[i][20]){
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][1]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [0,1];
                }
            }
        }
    }



	for (var key in tempCrimesCorrelation) {
		var newObject = {
			'date': parseDate3(key),
            'value1': tempCrimesCorrelation[key][0],
            'value2': tempCrimesCorrelation[key][1]
		}
		crimesCorrelationJSON.push(newObject);
	}

	crimesCorrelationJSON.sort(function (a, b) {
		return new Date(a.date) - new Date(b.date);
	})
}

// Adds the svg canvas
var svg = d3.select("#modal3")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate3(d.date);
        d.close = +d.close;
        d.open = +d.open;
    });

    // Scale the range of the data
    x3.domain(d3.extent(data, function(d) { return d.date; }));
    y3.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the valueline2 path.
    svg.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});

var hideSimilarOnFirstSelect = function(){
    var childrenFirst = document.getElementById("crimeTypes1Correlation").childNodes;
    var secondSelectionValue = document.getElementById("crimeTypes2Correlation").value;
    for(var child=1; child<childrenFirst.length; child=child+2){
        if(secondSelectionValue == childrenFirst[child].value){
            childrenFirst[child].style.display = "none";
        }
        else{
           childrenFirst[child].style.display = "block";
        }
    }
}

var hideSimilarOnSecondSelect = function(){
    var childrenSecond = document.getElementById("crimeTypes2Correlation").childNodes;
    var firstSelectionValue = document.getElementById("crimeTypes1Correlation").value;
    for(var child=1; child < childrenSecond.length; child=child+2){
        if(firstSelectionValue == childrenSecond[child].value){
            childrenSecond[child].style.display = "none";
        }
        else{
            childrenSecond[child].style.display = "block";
        }
    }
}