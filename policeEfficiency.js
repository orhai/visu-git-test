var svg4 = [];
// var projection4 = [];
var width4 = 700;
var height4 = 800;
var path4;
var wards4 = [];
var wardsCentriods = [];
var radius = 50;
var vis;
var colorScale = d3.scale.linear().domain([0, 80]).range(["white", "blue"]);
var colorScale2 = d3.scale.ordinal()
    .range(["LimeGreen","OrangeRed"]);
var pieRadius = 140;
var policeEfficiencyMain = function () {


    //Load in GeoJSON data
    d3.json("Boundaries - Wards (2015-).geojson", function (json) {
        wards4 = json;

        // create a first guess for the projection
        var center4 = d3.geo.centroid(json);
        var scale = 170; // original 150
        var projection4 = d3.geo.mercator().scale(scale).center(center4);
        //Define path generator
        var path4 = d3.geo.path()
            .projection(projection4);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        var bounds = path4.bounds(json);
        console.log("max longtitude: " + bounds[1][0]);
        var hscale = scale * width4 / (bounds[1][0] - bounds[0][0]);
        console.log("hscale: " + hscale);
        console.log("max langitude: " + bounds[1][1]);
        var vscale = scale * height4 / (bounds[1][1] - bounds[0][1]);
        var scale = (hscale < vscale) ? hscale : vscale;
        var offset = [550,550];
        // var offset = [width4 - (bounds[0][0] + bounds[1][0]) / 2,
        // height4 - (bounds[0][1] + bounds[1][1]) / 2];

        // new projection4
        projection4 = d3.geo.mercator().center(center4)
            .scale(scale * 0.8).translate(offset);
        path4 = path4.projection(projection4);

        ///////////////////PIECHART /////////////////////

        var w = 300;                        //width
        var h = 800;                            //height
        var r = 100;                           //radius
        var widthScale = d3.scale.linear().domain([0, 80]).range([0, w]);



        var dataSet = [];
        // Define the div for the tooltip
        var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("background-color","gray")
                    .style("opacity", 0);

        vis = d3.select("#modal4")
            .append("svg:svg")
            .data([dataSet])
            .attr("width", w)
            .attr("height", h)
            .attr("id", "vis4")
            .append("svg:g")
            .attr("transform", "translate(" + 150 + "," + 380 + ")")


        ////////////////////PIECHART/////////////////////////

        //Create SVG element
        svg4 = d3.select("#modal4").append("svg")
            .attr("width", width4)
            .attr("height", height4)
            .attr("id", "svg4");

        //Bind data and create one path per GeoJSON feature
        svg4.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path4)
            .attr("id", function (d) {
                return "path_" + d.properties.ward;
            })
            .attr("class", "Ward")
            .style("stroke", "gray")
            .style("stroke-width", "1")
            .on("mouseover", function(d) {
                d3.select(this).attr('fill','orange');
                updatePie(this.id);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html("<b>Ward Number:" + (parseInt((this.id).split('_')[1])) + "</b>" )
                    .style("color","Blue")
                    .attr("font-weight","bold")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                document.getElementById('vis4').style.visibility = 'visible';
                })
            .on("mouseout", function(d) {
                d3.select(this).attr('fill','black');
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                document.getElementById('vis4').style.visibility = 'visible';
                updateAllWardsPie();
            });
        showWardCenters();
        updateAllWardsPie();


    });

}
var updateTotal = function(tempWardNum,crimesNumber,numerator,denominator){
    var tempWardNumber = document.getElementById("modal4wardnumber").innerHTML = tempWardNum;
    var tempTotal = document.getElementById("modal4totalcrimes").innerHTML = crimesNumber;
    var tempRatio = document.getElementById("modal4ratio").innerHTML = numerator +"/"+denominator;
    $('.fraction').each(function(key, value) {
        $this = $(this)
        var split = $this.html().split("/")
        if( split.length == 2 ){
            $this.html('<span class="top">'+split[0]+'</span><span class="bottom">'+split[1]+'</span>')
        }
    });

}

var updatePie = function (wardID) {
    var tempID = parseInt(wardID.split('_')[1]) - 1;
    var arrested = wardsCentriods[tempID].arrested;
    var notArrested = wardsCentriods[tempID].totalCrimes - wardsCentriods[tempID].arrested;
    var numerator = math.fraction(arrested,wardsCentriods[tempID].totalCrimes).n;
    var denominator = math.fraction(arrested,wardsCentriods[tempID].totalCrimes).d;
    updateTotal(tempID + 1,wardsCentriods[tempID].totalCrimes,numerator,denominator);
    var tempData = [
        {value : arrested , color : "LimeGreen" },
        {value : notArrested, color: "OrangeRed"}
    ]
    console.log("Temp DATA : " , tempData);
    vis.select("g").remove();

    var group = vis.append("g");

    var arc = d3.svg.arc()
        .outerRadius(pieRadius)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .value(function (d) { return d.value; });

    var arcs = group.selectAll(".arc")
        .data(pie(tempData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("stroke","white")
        .attr("stroke-width","0.8")
        .attr("fill", function (d) {
            return d.data.color;
        });

    arcs.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .attr("font-weight","bold")
        .text(function (d) {
            return d.data.value;
        });
}

var updateAllWardsPie = function () {
    var arrested = 0;
    var notArrested = 0;
    for(var i = 0 ; i < wardsCentriods.length ; i++){
        arrested = arrested + wardsCentriods[i].arrested;
        notArrested = notArrested + (wardsCentriods[i].totalCrimes - wardsCentriods[i].arrested);
    }
    var numerator = math.fraction(arrested,notArrested + arrested).n;
    var denominator = math.fraction(arrested,notArrested + arrested).d;
    updateTotal("ALL",arrested + notArrested,numerator,denominator);
    var tempData = [
        {value : arrested , color : "LimeGreen" },
        {value : notArrested, color: "OrangeRed"}
    ]
    console.log("Temp DATA : " , tempData);
    vis.select("g").remove();

    var group = vis.append("g");

    var arc = d3.svg.arc()
        .outerRadius(pieRadius)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .value(function (d) { return d.value; });

    var arcs = group.selectAll(".arc")
        .data(pie(tempData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("stroke","white")
        .attr("stroke-width","0.8")
        .attr("fill", function (d) {
            return d.data.color;
        });

    arcs.append("text")
        .attr("transform", function (d) {
           return "translate(" + arc.centroid(d) + ")";
        })
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .attr("font-weight","bold")
        .text(function (d) {
            return d.data.value;
        });
}

var getWardsCentroids = function () {
    wardsCentriods = [];
    for (var i = 0; i < wards4.features.length; i++) {
        wardsCentriods[i] = {
            cordinates: d3.geo.centroid(wards4.features[i]),
            wardNumber: wards4.features[i].properties.ward,
            totalCrimes: "0",
            arrested: "0"
        };
    }

    wardsCentriods.sort(function (ward1, ward2) {
        return (parseInt(ward1.wardNumber) > parseInt(ward2.wardNumber)) ? 1 : -1;
    });
    for (var i = 0; i < wardsCentriods.length; i++) {
        console.log("current ward: " + wardsCentriods[i].wardNumber);
    }

    loadArrestesToCentroids();
}

var loadArrestesToCentroids = function () {
    for (var i = 0; i < crimes.length; i++) {
        var currentWard = crimes[i][20];
        wardsCentriods[currentWard - 1].totalCrimes = parseInt(wardsCentriods[currentWard - 1].totalCrimes) + 1;
        var arrested = crimes[i][16];
        if (arrested) {
            wardsCentriods[currentWard - 1].arrested = parseInt(wardsCentriods[currentWard - 1].arrested) + 1;
        }
    }
}

var showWardCenters = function () {
    getWardsCentroids();
    console.log(wardsCentriods);
    // var circles = svg4.selectAll("circle").data(wardsCentriods);
    // circles.enter().append("circle");
    // circles.attr("class", "ward")
    //     .attr("id", function (d) {
    //         return "ward_" + d.wardNumber;
    //     })
    //     .attr("cx", function (d) {
    //         if(d.wardNumber == '41'){
    //             return 480;
    //         }
    //         else if(d.wardNumber == '16'){
    //             return 750;
    //         }
    //         else if(d.wardNumber == '2'){
    //             return 750;
    //         }
    //         else if(d.wardNumber == '9'){
    //             return 810;
    //         }
    //         else if(d.wardNumber == '36'){
    //             return 580;
    //         }
    //         else if(d.wardNumber == '10'){
    //             return 880;
    //         }
    //         console.log("crime location degrees: " + d.cordinates[0] + ',' + d.cordinates[1]);
    //         console.log("crime location XY: " + projection([d.cordinates[0], d.cordinates[1]]));
    //         return projection([d.cordinates[0], d.cordinates[1]])[0];
    //     })
    //     .attr("cy", function (d) {
    //         if(d.wardNumber == '41'){
    //             return 272;
    //         }
    //         else if(d.wardNumber == '16'){
    //             return 640;
    //         }
    //         else if(d.wardNumber == '2'){
    //             return 460;
    //         }
    //         else if(d.wardNumber == '9'){
    //             return 825;
    //         }
    //         else if(d.wardNumber == '36'){
    //             return 360;
    //         }
    //         else if(d.wardNumber == '10'){
    //             return 825;
    //         }
    //         return projection([d.cordinates[0], d.cordinates[1]])[1];
    //     })
    //     .attr("r", "4px")
    //     .attr("fill", function (d) {
    //         console.log(d.wardNumber);
    //         if (d.wardNumber == 1) {
    //             console.log("dsfdsafdfdsfdsfasdfadfadf");
    //             return "red";
    //         }

    //         else {
    //             return "yellow";
    //         }
    //     });



}

var handleMouseIn = function () {
    d3.select(this).attr({
        fill: "orange",
    })

    console.log("THIS IS THE ID :", getElementID(this));
    console.log("THIS IS THE ID :", d3.select(this).id);

}

var handleMouseOut = function () {
    d3.select(this).attr({
        fill: "black",
    })
}

var getElementID = function (obj) {
    return obj.id;
}

var removeSVG4 = function(){
    d3.select("#modal4").selectAll("svg").remove();
}