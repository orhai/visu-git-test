var wardFinalRank = [];
var maxWardCrimes;
var radarChartMain = function () {
	// Set-Up

	var margin = { top: 100, right: 100, bottom: 100, left: 100 },
		width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	// data build
	var data2 = [[], [], []];

	maxWardCrimes = 0;
	var tempMax;
	if(document.getElementById("modal5selector").value == 'total_crimes'){
		for (var i = 0; i < crimes.length; i++) {
			// number of crimes
			if (data2[0][crimes[i][20] - 1] == undefined) {
				data2[0][crimes[i][20] - 1] = { axis: "Ward-" + crimes[i][20], value: 1 };
				tempMax = data2[0][crimes[i][20] - 1].value;
			}
			else {
				data2[0][crimes[i][20] - 1].value = data2[0][crimes[i][20] - 1].value + 1;
				tempMax = data2[0][crimes[i][20] - 1].value;
			}
			if (tempMax > maxWardCrimes) {
				maxWardCrimes = tempMax;
			}
			// arrest
			if (crimes[i][16] == true) {
				if (data2[1][crimes[i][20] - 1] == undefined) {
					data2[1][crimes[i][20] - 1] = { axis: "Ward-" + crimes[i][20], value: 1 };
				}
				else {
					data2[1][crimes[i][20] - 1].value = data2[1][crimes[i][20] - 1].value + 1;
				}
			}
			// domestic
			if (crimes[i][17] == true) {
				if (data2[2][crimes[i][20] - 1] == undefined) {
					data2[2][crimes[i][20] - 1] = { axis: "Ward-" + crimes[i][20], value: 1 };
				}
				else {
					data2[2][crimes[i][20] - 1].value = data2[2][crimes[i][20] - 1].value + 1;
				}
			}
		}

		//sort by what we want by number of crimes
		data2[0].sort(function (ward1, ward2) {
			return (ward1.value < ward2.value) ? 1 : -1;
		});

		//sort by what we want by number of crimes on arrest array
		tempArrests = [];
		tempDomestic = [];
		for (var i = 0; i < data2[1].length; i++) {
			tempArrests[i] = data2[1][i];
			tempDomestic[i] = data2[2][i];
		}

		for (var i = 0; i < data2[1].length; i++) {
			var wardNumberForCurrentIndex = parseInt(data2[0][i].axis.split("-")[1]);
			data2[1][i] = tempArrests[wardNumberForCurrentIndex - 1];
			data2[2][i] = tempDomestic[wardNumberForCurrentIndex - 1];
		}

		console.log("sorted data in radar : \n", data2);
	}
	else{
		generateRanks();
		data2 = [wardFinalRank];
	}
	// Draw the Chart

	var color = d3.scale.ordinal()
		.range(["#EDC951", "#CC333F", "#00A0B0"]);

	var radarChartOptions = {
		w: width*1.3,
		h: height*1.3,
		margin: margin,
		maxValue: maxWardCrimes,
		levels: 5,
		roundStrokes: true,
		color: color
	};
	//Call function to draw the Radar chart
	RadarChart("#modal5", data2, radarChartOptions);

}


function RadarChart(id, data, options) {
	var cfg = {
		w: 1200,
		h: 1200,
		margin: { top: 20, right: 20, bottom: 20, left: 20 },
		levels: 3,
		maxValue: 0,
		labelFactor: 1.25,
		wrapWidth: 60,
		opacityArea: 0.35,
		dotRadius: 4,
		opacityCircles: 0.1,
		strokeWidth: 2,
		roundStrokes: false,
		color: d3.scale.category10()
	};

	//Put all of the options into a variable called cfg
	if ('undefined' !== typeof options) {
		for (var i in options) {
			if ('undefined' !== typeof options[i]) {
				cfg[i] = options[i];
			}
		}
	}

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));

	var allAxis = (data[0].map(function (i, j) { return i.axis })),
		total = allAxis.length,
		radius = Math.min(cfg.w / 2, cfg.h / 2),
		Format = d3.format('!'),
		angleSlice = Math.PI * 2 / total;

	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);

	// Create the container SVG and g

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();

	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
		.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
		.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
		.attr("class", "radar" + id);
	//Append a g element
	var g = svg.append("g")
		.attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

	//Glow filter for some extra pizzazz

	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id', 'glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

	//Draw the Circular grid

	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
		.data(d3.range(1, (cfg.levels + 1)).reverse())
		.enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function (d, i) { return radius / cfg.levels * d; })
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter", "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
		.data(d3.range(1, (cfg.levels + 1)).reverse())
		.enter().append("text")
		.attr("class", "axisLabel")
		.attr("x", 4)
		.attr("y", function (d) { return -d * radius / cfg.levels; })
		.attr("dy", "0.4em")
		.style("font-size", "10px")
		.attr("fill", "#737373")
		.text(function (d, i) { return Format(maxValue * d / cfg.levels); });

	//Draw the axes

	//Create the straight lines radiating outward from the center
	var axis5 = axisGrid.selectAll(".axis5")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis5");
	//Append the lines
	axis5.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
		.attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis5.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
		.attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
		.text(function (d) { return d })
		.call(wrap, cfg.wrapWidth);

	//Draw the radar chart blobs

	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function (d) { return rScale(d.value); })
		.angle(function (d, i) { return i * angleSlice; });

	if (cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}

	//Create a wrapper for the blobs
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function (d, i) { return radarLine(d); })
		.style("fill", function (d, i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d, i) {
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', function () {
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function (d, i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function (d, i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter", "url(#glow)");

	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function (d, i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
		.attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
		.style("fill", function (d, i, j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	//Append invisible circles for tooltip

	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function (d, i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
		.attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function (d, i) {
			newX = parseFloat(d3.select(this).attr('cx')) - 10;
			newY = parseFloat(d3.select(this).attr('cy')) - 10;

			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function () {
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});

	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// Helper Function
	//Wraps SVG text
	function wrap(text, width) {
		text.each(function () {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4,
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}

}



var generateRanks = function () {
	var wardRanks = [];
	for (var i = 0; i < 50; i++) {
		wardRanks[i] = {
			domestic: 0,
			arrested: 0,
			total: 0,
			THEFT: 0,
			BATTERY: 0,
			DECEPTIVE_PRACTICE: 0,
			ASSAULT: 0,
			OTHER_OFFENSE: 0,
			CRIMINAL_DAMAGE: 0,
			ROBBERY: 0,
			MOTOR_VEHICLE_THEFT: 0,
			OFFENSE_INVOLVING_CHILDREN: 0,
			BURGLARY: 0,
			PROSTITUTION: 0,
			CRIMINAL_TRESPASS: 0,
			CRIM_SEXUAL_ASSAULT: 0,
			HOMICIDE: 0,
			ARSON: 0,
			WEAPONS_VIOLATION: 0,
			PUBLIC_PEACE_VIOLATION: 0,
			NARCOTICS: 0,
			LIQUOR_LAW_VIOLATION: 0,
			SEX_OFFENSE: 0,
			GAMBLING: 0,
			STALKING: 0,
			INTERFERENCE_WITH_PUBLIC_OFFICER: 0,
			KIDNAPPING: 0,
			INTIMIDATION: 0,
			CONCEALED_CARRY_LICENSE_VIOLATION: 0,
			OBSCENITY: 0,
			HUMAN_TRAFFICKING: 0,
			NON_CRIMINAL: 0,
			PUBLIC_INDECENCY: 0,
			OTHER_NARCOTIC_VIOLATION: 0,
			NON_CRIMINAL_SUBJECT_SPECIFIED: 0
		}
	}

	for (var i = 0; i < crimes.length; i++) {
		wardRanks[crimes[i][20] - 1].total = wardRanks[crimes[i][20] - 1].total + 1;
		if (crimes[i][13] == "HOMICIDE")
			wardRanks[crimes[i][20] - 1].HOMICIDE = wardRanks[crimes[i][20] - 1].HOMICIDE + 1;
		else if (crimes[i][13] == "THEFT")
			wardRanks[crimes[i][20] - 1].THEFT = wardRanks[crimes[i][20] - 1].THEFT + 1;
		else if (crimes[i][13] == "DECEPTIVE PRACTICE")
			wardRanks[crimes[i][20] - 1].DECEPTIVE_PRACTICE = wardRanks[crimes[i][20] - 1].DECEPTIVE_PRACTICE + 1;
		else if (crimes[i][13] == "BATTERY")
			wardRanks[crimes[i][20] - 1].BATTERY = wardRanks[crimes[i][20] - 1].BATTERY + 1;
		else if (crimes[i][13] == "ASSAULT")
			wardRanks[crimes[i][20] - 1].ASSAULT = wardRanks[crimes[i][20] - 1].ASSAULT + 1;
		else if (crimes[i][13] == "OTHER OFFENSE")
			wardRanks[crimes[i][20] - 1].OTHER_OFFENSE = wardRanks[crimes[i][20] - 1].OTHER_OFFENSE + 1;
		else if (crimes[i][13] == "CRIMINAL DAMAGE")
			wardRanks[crimes[i][20] - 1].CRIMINAL_DAMAGE = wardRanks[crimes[i][20] - 1].CRIMINAL_DAMAGE + 1;
		else if (crimes[i][13] == "ROBBERY")
			wardRanks[crimes[i][20] - 1].ROBBERY = wardRanks[crimes[i][20] - 1].ROBBERY + 1;
		else if (crimes[i][13] == "MOTOR VEHICLE THEFT")
			wardRanks[crimes[i][20] - 1].MOTOR_VEHICLE_THEFT = wardRanks[crimes[i][20] - 1].MOTOR_VEHICLE_THEFT + 1;
		else if (crimes[i][13] == "OFFENSE INVOLVING CHILDREN")
			wardRanks[crimes[i][20] - 1].OFFENSE_INVOLVING_CHILDREN = wardRanks[crimes[i][20] - 1].OFFENSE_INVOLVING_CHILDREN + 1;
		else if (crimes[i][13] == "BURGLARY")
			wardRanks[crimes[i][20] - 1].BURGLARY = wardRanks[crimes[i][20] - 1].BURGLARY + 1;
		else if (crimes[i][13] == "PROSTITUTION")
			wardRanks[crimes[i][20] - 1].PROSTITUTION = wardRanks[crimes[i][20] - 1].PROSTITUTION + 1;
		else if (crimes[i][13] == "CRIMINAL TRESPASS")
			wardRanks[crimes[i][20] - 1].CRIMINAL_TRESPASS = wardRanks[crimes[i][20] - 1].CRIMINAL_TRESPASS + 1;
		else if (crimes[i][13] == "CRIM SEXUAL ASSAULT")
			wardRanks[crimes[i][20] - 1].CRIM_SEXUAL_ASSAULT = wardRanks[crimes[i][20] - 1].CRIM_SEXUAL_ASSAULT + 1;
		else if (crimes[i][13] == "ARSON")
			wardRanks[crimes[i][20] - 1].ARSON = wardRanks[crimes[i][20] - 1].ARSON + 1;
		else if (crimes[i][13] == "WEAPONS VIOLATION")
			wardRanks[crimes[i][20] - 1].WEAPONS_VIOLATION = wardRanks[crimes[i][20] - 1].WEAPONS_VIOLATION + 1;
		else if (crimes[i][13] == "PUBLIC PEACE VIOLATION")
			wardRanks[crimes[i][20] - 1].PUBLIC_PEACE_VIOLATION = wardRanks[crimes[i][20] - 1].PUBLIC_PEACE_VIOLATION + 1;
		else if (crimes[i][13] == "NARCOTICS")
			wardRanks[crimes[i][20] - 1].NARCOTICS = wardRanks[crimes[i][20] - 1].NARCOTICS + 1;
		else if (crimes[i][13] == "LIQUOR LAW VIOLATION")
			wardRanks[crimes[i][20] - 1].LIQUOR_LAW_VIOLATION = wardRanks[crimes[i][20] - 1].LIQUOR_LAW_VIOLATION + 1;
		else if (crimes[i][13] == "SEX OFFENSE")
			wardRanks[crimes[i][20] - 1].SEX_OFFENSE = wardRanks[crimes[i][20] - 1].SEX_OFFENSE + 1;
		else if (crimes[i][13] == "GAMBLING")
			wardRanks[crimes[i][20] - 1].GAMBLING = wardRanks[crimes[i][20] - 1].GAMBLING + 1;
		else if (crimes[i][13] == "STALKING")
			wardRanks[crimes[i][20] - 1].STALKING = wardRanks[crimes[i][20] - 1].STALKING + 1;
		else if (crimes[i][13] == "INTERFERENCE WITH PUBLIC OFFICER")
			wardRanks[crimes[i][20] - 1].INTERFERENCE_WITH_PUBLIC_OFFICER = wardRanks[crimes[i][20] - 1].INTERFERENCE_WITH_PUBLIC_OFFICER + 1;
		else if (crimes[i][13] == "KIDNAPPING")
			wardRanks[crimes[i][20] - 1].KIDNAPPING = wardRanks[crimes[i][20] - 1].KIDNAPPING + 1;
		else if (crimes[i][13] == "INTIMIDATION")
			wardRanks[crimes[i][20] - 1].INTIMIDATION = wardRanks[crimes[i][20] - 1].INTIMIDATION + 1;
		else if (crimes[i][13] == "OBSCENITY")
			wardRanks[crimes[i][20] - 1].OBSCENITY = wardRanks[crimes[i][20] - 1].OBSCENITY + 1;
		else if (crimes[i][13] == "NON-CRIMINAL")
			wardRanks[crimes[i][20] - 1].NON_CRIMINAL = wardRanks[crimes[i][20] - 1].NON_CRIMINAL + 1;
		else if (crimes[i][13] == "HUMAN TRAFFICKING")
			wardRanks[crimes[i][20] - 1].HUMAN_TRAFFICKING = wardRanks[crimes[i][20] - 1].HUMAN_TRAFFICKING + 1;
		else if (crimes[i][13] == "PUBLIC INDECENCY")
			wardRanks[crimes[i][20] - 1].PUBLIC_INDECENCY = wardRanks[crimes[i][20] - 1].PUBLIC_INDECENCY + 1;
		else if (crimes[i][13] == "OTHER NARCOTIC VIOLATION")
			wardRanks[crimes[i][20] - 1].OTHER_NARCOTIC_VIOLATION = wardRanks[crimes[i][20] - 1].OTHER_NARCOTIC_VIOLATION + 1;
		else if (crimes[i][13] == "INTERFERENCE WITH PUBLIC OFFICER")
			wardRanks[crimes[i][20] - 1].INTERFERENCE_WITH_PUBLIC_OFFICER = wardRanks[crimes[i][20] - 1].INTERFERENCE_WITH_PUBLIC_OFFICER + 1;
		else if (crimes[i][13] == "NON-CRIMINAL (SUBJECT SPECIFIED)") {
			console.log("index is: ", i);
			console.log(crimes[i]);
			wardRanks[crimes[i][20] - 1].NON_CRIMINAL_SUBJECT_SPECIFIED = wardRanks[crimes[i][20] - 1].NON_CRIMINAL_SUBJECT_SPECIFIED + 1;
		}

		if (crimes[i][17]) {
			wardRanks[crimes[i][20] - 1].domestic = wardRanks[crimes[i][20] - 1].domestic + 1;
		}
		if (crimes[i][16]) {
			wardRanks[crimes[i][20] - 1].arrested = wardRanks[crimes[i][20] - 1].arrested + 1;
		}

	}


	for (var i = 0; i < 50; i++) {
		var total = wardRanks[i].total / 2;
		// All of the weights were calculated by the maximus sentence of Illinois's laws
		 var wardTempRank= (60 * wardRanks[i].HOMICIDE +
			15 * wardRanks[i].THEFT +
			3 * wardRanks[i].DECEPTIVE_PRACTICE +
			30 * wardRanks[i].BATTERY +
			0.5 * wardRanks[i].ASSAULT +
			1 * wardRanks[i].OTHER_OFFENSE +
			55 * wardRanks[i].ROBBERY +
			30 * wardRanks[i].MOTOR_VEHICLE_THEFT +
			15 * wardRanks[i].OFFENSE_INVOLVING_CHILDREN +
			15 * wardRanks[i].BURGLARY +
			1 * wardRanks[i].PROSTITUTION +
			2 * wardRanks[i].CRIMINAL_TRESPASS +
			60 * wardRanks[i].CRIM_SEXUAL_ASSAULT +
			15 * wardRanks[i].ARSON +
			5 * wardRanks[i].WEAPONS_VIOLATION +
			((wardRanks[i].PUBLIC_PEACE_VIOLATION >= 1) ? 0.1 : 0) +
			30 * wardRanks[i].NARCOTICS +
			10 * wardRanks[i].LIQUOR_LAW_VIOLATION +
			30 * wardRanks[i].SEX_OFFENSE +
			3 * wardRanks[i].GAMBLING +
			5 * wardRanks[i].STALKING +
			5 * wardRanks[i].INTERFERENCE_WITH_PUBLIC_OFFICER +
			30 * wardRanks[i].KIDNAPPING +
			5 * wardRanks[i].INTIMIDATION +
			5 * wardRanks[i].CONCEALED_CARRY_LICENSE_VIOLATION +
			5 * wardRanks[i].OBSCENITY +
			((wardRanks[i].NON_CRIMINAL_SUBJECT_SPECIFIED >= 1) ? 0.1 : 0) +
			11 * wardRanks[i].HUMAN_TRAFFICKING +
			1 * wardRanks[i].PUBLIC_INDECENCY +
			((wardRanks[i].OTHER_NARCOTIC_VIOLATION >= 1) ? 0.1 : 0) +
			((wardRanks[i].NON_CRIMINAL_SUBJECT_SPECIFIED >= 1) ? 0.1 : 0) +

			50 * wardRanks[i].arrested +
			50 * wardRanks[i].domestic
		) / total;
		wardFinalRank[i] = { axis: "Ward-" + (i+1), value: wardTempRank.toFixed(2) }
		if(wardFinalRank[i].value > maxWardCrimes){
			maxWardCrimes = wardFinalRank[i].value;
		}
	}
	//sort by what we want by number of crimes
	wardFinalRank.sort(function (ward1, ward2) {
		return (ward1.value < ward2.value) ? 1 : -1;
	});
	maxWardCrimes= math.round(maxWardCrimes)+1;
	console.log(wardRanks);
	console.log(wardFinalRank);
}