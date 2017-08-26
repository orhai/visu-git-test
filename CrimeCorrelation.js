//Main function that gets called on onclick.
var crimeCorrelationMain = function () {
    createCrimeCorrelationSVG();
}

// Parse the date / time
var parseDate3 = d3.time.format("%Y-%m-%d").parse;

var tempCrimesCorrelation = {};
var crimesCorrelationJSON = [];
var getValuesOfTwoCrimeTypes = function (crime, crimeType1, crimeType2, wardNumber) {
    tempCrimesCorrelation = {};
    crimesCorrelationJSON = [];
    var month_day = "";
    for (var i = 0; i < crime.length; i++) {
        if (wardNumber == "ALL") {
            if (crimeType1 == crime[i][13]) {
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][0]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [1, 0];
                }
            }
            else if (crimeType2 == crime[i][13]) {
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][1]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [0, 1];
                }
            }
        }
        else if (wardNumber != "ALL") {
            if (crimeType1 == crime[i][13] && wardNumber == crime[i][20]) {
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][0]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [1, 0];
                }
            }
            else if (crimeType2 == crime[i][13] && wardNumber == crime[i][20]) {
                month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
                console.log("month_Day: ", month_day);
                if (tempCrimesCorrelation[month_day] != undefined) {
                    tempCrimesCorrelation[month_day][1]++;
                }
                else {
                    tempCrimesCorrelation[month_day] = [0, 1];
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



// Get the data
var createCrimeCorrelationSVG = function () {
    // Set the dimensions of the canvas / graph
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;




    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    //delele old svg.
    var parentOfItem2delete = document.getElementById("modal3");
    var item2delete = document.getElementById("svg3");
    if (item2delete != null) {
        parentOfItem2delete.removeChild(item2delete);

    }
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.value1); });

    // Define the line2
    var valueline2 = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.value2); });


    // Adds the svg canvas
    var svg3 = d3.select("#modal3")
        .append("svg")
        .attr("id", "svg3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    var type1 = document.getElementById("crimeTypes1Correlation").value;
    var type2 = document.getElementById("crimeTypes2Correlation").value;
    var wardNumber = document.getElementById("wardNumber3").value;
    getValuesOfTwoCrimeTypes(crimes, type1, type2, wardNumber);
    // Scale the range of the data
    x.domain(d3.extent(crimesCorrelationJSON, function (d) { return d.date; }));
    y.domain([0, d3.max(crimesCorrelationJSON, function (d) { return Math.max(d.value1, d.value2); })]);

    // Add the valueline path.
    svg3.append("path")
        .attr("class", "line")
        .style("stroke", "magenta")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .attr("d", valueline(crimesCorrelationJSON));

    // Add the valueline2 path.
    svg3.append("path")
        .attr("class", "line2")
        .style("stroke", "DarkGreen")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .attr("d", valueline2(crimesCorrelationJSON));

    // Add the X Axis
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}

var hideSimilarOnFirstSelect = function () {
    var childrenFirst = document.getElementById("crimeTypes1Correlation").childNodes;
    var secondSelectionValue = document.getElementById("crimeTypes2Correlation").value;
    for (var child = 1; child < childrenFirst.length; child = child + 2) {
        if (secondSelectionValue == childrenFirst[child].value) {
            childrenFirst[child].style.display = "none";
        }
        else {
            childrenFirst[child].style.display = "block";
        }
    }
}

var hideSimilarOnSecondSelect = function () {
    var childrenSecond = document.getElementById("crimeTypes2Correlation").childNodes;
    var firstSelectionValue = document.getElementById("crimeTypes1Correlation").value;
    for (var child = 1; child < childrenSecond.length; child = child + 2) {
        if (firstSelectionValue == childrenSecond[child].value) {
            childrenSecond[child].style.display = "none";
        }
        else {
            childrenSecond[child].style.display = "block";
        }
    }
}