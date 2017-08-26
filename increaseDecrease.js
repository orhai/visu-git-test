
//Main function that gets called on onclick.
var increaseDecreaseMain = function() {
	createIncreaseDecreaseSVG();
}

var parseDate = d3.time.format("%Y-%m-%d").parse;


/* Increase Decrease */
var ward1AssauLtBymonths = {};
var increaseDecreaseJson = [];

var getWard1AssauLtBymonths = function (crime, wardNumber, crimeType) {
	ward1AssauLtBymonths = {};
	increaseDecreaseJson = [];
	var month_day = "";
	if (wardNumber == "ALL" && crimeType == "ALL") {
		for (var i = 0; i < crime.length; i++) {
			month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
			console.log("month_Day: ", month_day);
			if (ward1AssauLtBymonths[month_day] != undefined) {
				ward1AssauLtBymonths[month_day]++;
			}
			else {
				ward1AssauLtBymonths[month_day] = 1;
			}
		}
	}
	else if (wardNumber != "ALL" && crimeType == "ALL") {
		for (var i = 0; i < crime.length; i++) {
			month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
			console.log("month_Day: ", month_day);
			if (crime[i][20] == wardNumber) {
				if (ward1AssauLtBymonths[month_day] != undefined) {
					ward1AssauLtBymonths[month_day]++;
				}
				else {
					ward1AssauLtBymonths[month_day] = 1;
				}
			}
		}
	}
	else if (wardNumber == "ALL" && crimeType != "ALL") {
		for (var i = 0; i < crime.length; i++) {
			month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
			console.log("month_Day: ", month_day);
			if (crime[i][13] == crimeType) {
				if (ward1AssauLtBymonths[month_day] != undefined) {
					ward1AssauLtBymonths[month_day]++;
				}
				else {
					ward1AssauLtBymonths[month_day] = 1;
				}
			}
		}
	}
	else {
		for (var i = 0; i < crime.length; i++) {
			month_day = "2017-" + crime[i][10].split('-')[1] + "-" + crime[i][10].split('-')[2].split("T")[0];
			console.log("month_Day: ", month_day);
			if (crime[i][13] == crimeType && crime[i][20] == wardNumber) {
				if (ward1AssauLtBymonths[month_day] != undefined) {
					ward1AssauLtBymonths[month_day]++;
				}
				else {
					ward1AssauLtBymonths[month_day] = 1;
				}
			}
		}
	}

	var curMax = 0;
	for (var key in ward1AssauLtBymonths) {
		var newObject = {
			'date': parseDate(key),
			'value': ward1AssauLtBymonths[key]
		}
		increaseDecreaseJson.push(newObject);
		if(newObject.value > curMax){
			curMax = newObject.value;
		}
	}

	increaseDecreaseJson.sort(function (a, b) {
		return new Date(a.date) - new Date(b.date);
	})
	return curMax;
}


var createIncreaseDecreaseSVG = function () {
	var margin = { top: 20, right: 20, bottom: 70, left: 40 },
	width = 1200 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

// Parse the date / time

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

	var type = document.getElementById("crimeTypes").value;
	var number = document.getElementById("wardNumber").value;
	var parentOfItem2delete = document.getElementById("modal1");
	var item2delete = document.getElementById("svg1");
	if (item2delete != null) {
		parentOfItem2delete.removeChild(item2delete);

	}
	console.log("Type and number are: ", type, number);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.time.format("%Y-%m-%d"));
		// .ticks(10);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#modal1").append("svg")
		.attr("id","svg1")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

	var Max = getWard1AssauLtBymonths(crimes, number, type);
	console.log("this is the global crimes: ", crimes[1]);
	console.log("Max is: ",Max);
	x.domain(increaseDecreaseJson.map(function (d) { return d.date; }));
	y.domain([0, d3.max(increaseDecreaseJson, function (d) { return d.value; })]);


	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", "-.55em")
		.attr("transform", "rotate(-90)")
		.style("font-size" , "9px");


	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Value ($)");

	svg.selectAll("bar")
		.data(increaseDecreaseJson)
		.enter().append("rect")
		// .style("fill", "green")
		.attr("fill", function (d) {
			if (d.value > Max*2/3) {
				return "red";
			} else if (d.value <= Max*2/3 && d.value > Max/3) {
				return "blue";
			}
			return "green";
		})
		.attr("x", function (d) { return x(d.date); })
		.attr("width", x.rangeBand())
		.attr("y", function (d) { return y(d.value); })
		.attr("height", function (d) { return height - y(d.value); });
}

/* END OF Increase Decrease*/