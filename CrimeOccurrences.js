var svg2 = [];
var projection = [];
//Width and height
var width2 = 1000;
var height2 = 800;
var boundariesJSON = [];
var path2;
var gPath = [];
//Load in GeoJSON data
d3.json("Boundaries - Wards (2015-).geojson", function (json) {

    // create a first guess for the projection
    var center = d3.geo.centroid(json);
    var scale = 170; // original 150
    projection = d3.geo.mercator().scale(scale).center(center);
    console.log("XY of [-87.67762151065274, 41.91775780106294] :" + projection([-87.67762151065274, 41.91775780106294])[0]);
    //Define path generator
    path2 = d3.geo.path()
        .projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds = path2.bounds(json);
    console.log("max longtitude: " + bounds[1][0]);
    var hscale = scale * width2 / (bounds[1][0] - bounds[0][0]);
    console.log("hscale: " + hscale);
    console.log("max langitude: " + bounds[1][1]);
    var vscale = scale * height2 / (bounds[1][1] - bounds[0][1]);
    var scale = (hscale < vscale) ? hscale : vscale;
    var offset = [width2 - (bounds[0][0] + bounds[1][0]) / 2,
    height2 - (bounds[0][1] + bounds[1][1]) / 2];

    // new projection
    projection = d3.geo.mercator().center(center)
        .scale(scale * 0.8).translate(offset);
    path2 = path2.projection(projection);

    boundariesJSON = json;



});


var crimeQuantityEachWard = [];
// Get values of all wards and crimes
var getWardsAndCrimesValues = function () {

    crimeQuantityEachWard = [];
    for (var i = 0; i < 50; i++) {
        crimeQuantityEachWard[i] = 0;
    }

    var ALL = document.getElementById("ALL");
    var HOMICIDE = document.getElementById("HOMICIDE");
    var THEFT = document.getElementById("THEFT");
    var DECEPTIVE_PRACTICE = document.getElementById("DECEPTIVE_PRACTICE");
    var BATTERY = document.getElementById("BATTERY");
    var ASSAULT = document.getElementById("ASSAULT");
    var OTHER_OFFENSE = document.getElementById("OTHER_OFFENSE");
    var CRIMINAL_DAMAGE = document.getElementById("CRIMINAL_DAMAGE");
    var ROBBERY = document.getElementById("ROBBERY");
    var MOTOR_VEHICLE_THEFT = document.getElementById("MOTOR_VEHICLE_THEFT");
    var OFFENSE_INVOLVING_CHILDREN = document.getElementById("OFFENSE_INVOLVING_CHILDREN");
    var BURGLARY = document.getElementById("BURGLARY");
    var PROSTITUTION = document.getElementById("PROSTITUTION");
    var CRIMINAL_TRESPASS = document.getElementById("CRIMINAL_TRESPASS");
    var CRIM_SEXUAL_ASSAULT = document.getElementById("CRIM_SEXUAL_ASSAULT");
    var ARSON = document.getElementById("ARSON");
    var WEAPONS_VIOLATION = document.getElementById("WEAPONS_VIOLATION");
    var PUBLIC_PEACE_VIOLATION = document.getElementById("PUBLIC_PEACE_VIOLATION");
    var NARCOTICS = document.getElementById("NARCOTICS");
    var LIQUOR_LAW_VIOLATION = document.getElementById("LIQUOR_LAW_VIOLATION");
    var SEX_OFFENSE = document.getElementById("SEX_OFFENSE");
    var GAMBLING = document.getElementById("GAMBLING");
    var STALKING = document.getElementById("STALKING");
    var INTERFERENCE_WITH_PUBLIC_OFFICER = document.getElementById("INTERFERENCE_WITH_PUBLIC_OFFICER");
    var KIDNAPPING = document.getElementById("KIDNAPPING");
    var INTIMIDATION = document.getElementById("INTIMIDATION");
    var CONCEALED_CARRY_LICENSE_VIOLATION = document.getElementById("CONCEALED_CARRY_LICENSE_VIOLATION");
    var OBSCENITY = document.getElementById("OBSCENITY");
    var NON_CRIMINAL = document.getElementById("NON_CRIMINAL");
    var HUMAN_TRAFFICKING = document.getElementById("HUMAN_TRAFFICKING");
    var PUBLIC_INDECENCY = document.getElementById("PUBLIC_INDECENCY");
    var OTHER_NARCOTIC_VIOLATION = document.getElementById("OTHER_NARCOTIC_VIOLATION");
    var NON_CRIMINAL_SUBJECT_SPECIFIED = document.getElementById("NON_CRIMINAL_SUBJECT_SPECIFIED");

    var ward_selector = document.getElementById("wardNumber2");

    for (var i = 0; i < crimes.length; i++) {
        if (ALL.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "HOMICIDE" && HOMICIDE.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "THEFT" && THEFT.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "DECEPTIVE PRACTICE" && DECEPTIVE_PRACTICE.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "BATTERY" && BATTERY.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "ASSAULT" && ASSAULT.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "OTHER OFFENSE" && OTHER_OFFENSE.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "CRIMINAL DAMAGE" && CRIMINAL_DAMAGE.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "ROBBERY" && ROBBERY.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "MOTOR VEHICLE THEFT" && MOTOR_VEHICLE_THEFT.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "OFFENSE INVOLVING CHILDREN" && OFFENSE_INVOLVING_CHILDREN.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "BURGLARY" && BURGLARY.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "PROSTITUTION" && PROSTITUTION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "CRIMINAL TRESPASS" && CRIMINAL_TRESPASS.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "CRIM SEXUAL ASSAULT" && CRIM_SEXUAL_ASSAULT.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "ARSON" && ARSON.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "WEAPONS VIOLATION" && WEAPONS_VIOLATION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "PUBLIC PEACE VIOLATION" && PUBLIC_PEACE_VIOLATION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "NARCOTICS" && NARCOTICS.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "LIQUOR LAW VIOLATION" && LIQUOR_LAW_VIOLATION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "SEX OFFENSE" && SEX_OFFENSE.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "GAMBLING" && GAMBLING.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "STALKING" && STALKING.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "INTERFERENCE WITH PUBLIC OFFICER" && INTERFERENCE_WITH_PUBLIC_OFFICER.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "KIDNAPPING" && KIDNAPPING.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "INTIMIDATION" && INTIMIDATION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "OBSCENITY" && OBSCENITY.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "NON-CRIMINAL" && NON_CRIMINAL.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "HUMAN TRAFFICKING" && HUMAN_TRAFFICKING.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "PUBLIC INDECENCY" && PUBLIC_INDECENCY.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "OTHER NARCOTIC VIOLATION" && OTHER_NARCOTIC_VIOLATION.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "INTERFERENCE WITH PUBLIC OFFICER" && INTERFERENCE_WITH_PUBLIC_OFFICER.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
        else if (crimes[i][13] == "NON-CRIMINAL (SUBJECT SPECIFIED)" && NON_CRIMINAL_SUBJECT_SPECIFIED.checked == true)
            crimeQuantityEachWard[crimes[i][20] - 1] = crimeQuantityEachWard[crimes[i][20] - 1] + 1;
    }

    //calculate max
    var max = 0;
    for (var i = 0; i < crimeQuantityEachWard.length; i++) {
        if (crimeQuantityEachWard[i] > max) {
            max = crimeQuantityEachWard[i];
        }
    }
    return max;
}


var crimeTypes = [];
var crimeLoacationTypes = [];
var wards = [];
var crimeoccurencesMain = function () {

    var maxForColor = getWardsAndCrimesValues();
    console.log("maxForColor is: ", maxForColor);
    var colorScale2 = d3.scale.linear().domain([0, maxForColor]).range(["oldlace", "firebrick"]);

    var parentOfItem2delete = document.getElementById("modal2");
    var item2delete = document.getElementById("svg2");
    if (item2delete != null) {
        parentOfItem2delete.removeChild(item2delete);

    }
    // Define the div for the tooltip
    var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("background-color","gray")
                .style("opacity", 0);

    //Create SVG element
    svg2 = d3.select("#modal2").append("svg")
        .attr("width", width2)
        .attr("height", height2)
        .attr("id", "svg2");




    // Create legend
    var legenedArray = [];
    var legendFirstRectCordinates = [0,0];
    for( var i = 0 ; i < 10 ; i++){
        legenedArray[i] = { "quantity" : (maxForColor/10)*(i+1)
                                ,"location" :  [0,32*(i)]};
    }

    var g = svg2.append("g").attr("transform" , "translate(200,300)");

    g.selectAll("rect").data(legenedArray)
                        .enter()
                        .append("rect")
                        .attr("height" ,30)
                        .attr("width" , 60)
                        .attr("x",function(d){
                            return d.location[0];
                        })
                        .attr("y",function(d){
                            return d.location[1];
                        })
                        .attr("fill", function(d){
                            return colorScale2(d.quantity);
                        });

    g.selectAll("text").data(legenedArray)
                        .enter()
                        .append("text")
                        .text(function(d){
                            return "<" + math.round(d.quantity);
                        })
                        .attr("x",function(d){
                            return d.location[0]+66;
                        })
                        .attr("y",function(d){
                            return d.location[1]+19;
                        })
                        .attr("font-size","12px")
                        .attr("text-anchor", "start")
                        .attr("font-family","Comic Sans MS");

    g.append("text")
                    .text("Crime Rate")
                    .attr("x",-10)
                    .attr("y",-10)
                    .attr("font-size","20px")
                    .attr("text-anchor", "start")
                    .attr("font-family","Comic Sans MS");


    gPath = svg2.append("g");

    //Bind data and create one path per GeoJSON feature
    gPath = svg2.selectAll("path")
        .data(boundariesJSON.features)
        .enter()
        .append("path")
        .attr("d", path2)
        .attr("class", "Ward")
        .attr("id", function (d) {
            return "path_" + d.properties.ward;
        })
        .attr("transform" , "translate(400,20)")
        .style("stroke", "white")
        .style("stroke-width", "1")
        .style("fill", function (d) {
            var wardNumber = d.properties.ward;
            var quantity = crimeQuantityEachWard[wardNumber - 1];
            return colorScale2(quantity);
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("<b>Ward Number:" + (parseInt((this.id).split('_')[1])) )
                .style("color","Blue")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            d3.select(this).style("stroke", "#FF0F0F");
            d3.select(this).style("stroke-width", "1px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).style("stroke", "white");
            d3.select(this).style("stroke-width", "1");
        });
        // .attr("onmouseover", "d3.select(this).attr('opactiy','0.4'); "
        // + " updateWarnNumber(this.id);")
        // .attr("onmouseout", "d3.select(this).attr('opactiy','1'); ");



    console.log("crimes length: " + crimeQuantityEachWard.length);
    console.log("crime 1: " + crimeQuantityEachWard[1]);
    console.log("crime 1 latitude: " + crimeQuantityEachWard[1][27]);
    console.log("crime 1 longitude: " + crimeQuantityEachWard[1][28]);


    getCrimeList(crimes);
    svg2.call(zoom);
}

var getCrimeList = function (crimes) {
    for (var i = 0; i < crimes.length; i++) {
        if (crimeTypes.indexOf(crimes[i][13]) == -1) {
            crimeTypes.push(crimes[i][13]);
        }
    }
    console.log("Types: " + crimeTypes);
}

var getCrimeLocationsList = function (crimes) {
    for (var i = 0; i < crimes.length; i++) {
        if (crimeLoacationTypes.indexOf(crimes[i][15]) == -1) {
            crimeLoacationTypes.push(crimes[i][15]);
        }
    }
    console.log("Types: " + crimeLoacationTypes);
}

var getWardsList = function (crimes) {
    for (var i = 0; i < crimes.length; i++) {
        if (wards.indexOf(crimes[i][20]) == -1) {
            wards.push(crimes[i][20]);
        }
    }
    console.log("Types: " + wards);
}


/* Dropdown with Multiple checkbox select with jQuery */
$(".dropdown dt a").on('click', function () {
    $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function () {
    $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
    return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function (e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('change', function () {
    changeCheckBoxes(clearALL);
    var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
        title = $(this).val() + ",";

    if ($(this).is(':checked')) {
        var html = '<span title="' + title + '">' + title + '</span>';
        $('.multiSel').append(html);
        $(".hida").hide();
    } else {
        $('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        $('.dropdown dt a').append(ret);

    }
});
/* END OF Dropdown with Multiple checkbox select with jQuery */

//Function to change the checkboxes if the All option is checked then all other boxes are unchecked.
var clearALL = true;
var changeCheckBoxes = function (clearAll) {
    if (clearAll) {
        document.getElementById('ALL').checked = false;
    }
    else {
        document.getElementById('THEFT').checked = false;
        document.getElementById('BATTERY').checked = false;
        document.getElementById('DECEPTIVE_PRACTICE').checked = false;
        document.getElementById('ASSAULT').checked = false;
        document.getElementById('OTHER_OFFENSE').checked = false;
        document.getElementById('CRIMINAL_DAMAGE').checked = false;
        document.getElementById('ROBBERY').checked = false;
        document.getElementById('MOTOR_VEHICLE_THEFT').checked = false;
        document.getElementById('OFFENSE_INVOLVING_CHILDREN').checked = false;
        document.getElementById('BURGLARY').checked = false;
        document.getElementById('PROSTITUTION').checked = false;
        document.getElementById('CRIMINAL_TRESPASS').checked = false;
        document.getElementById('CRIM_SEXUAL_ASSAULT').checked = false;
        document.getElementById('HOMICIDE').checked = false;
        document.getElementById('ARSON').checked = false;
        document.getElementById('WEAPONS_VIOLATION').checked = false;
        document.getElementById('PUBLIC_PEACE_VIOLATION').checked = false;
        document.getElementById('NARCOTICS').checked = false;
        document.getElementById('LIQUOR_LAW_VIOLATION').checked = false;
        document.getElementById('SEX_OFFENSE').checked = false;
        document.getElementById('GAMBLING').checked = false;
        document.getElementById('STALKING').checked = false;
        document.getElementById('INTERFERENCE_WITH_PUBLIC_OFFICER').checked = false;
        document.getElementById('KIDNAPPING').checked = false;
        document.getElementById('INTIMIDATION').checked = false;
        document.getElementById('CONCEALED_CARRY_LICENSE_VIOLATION').checked = false;
        document.getElementById('OBSCENITY').checked = false;
        document.getElementById('HUMAN_TRAFFICKING').checked = false;
        document.getElementById('NON_CRIMINAL').checked = false;
        document.getElementById('PUBLIC_INDECENCY').checked = false;
        document.getElementById('OTHER_NARCOTIC_VIOLATION').checked = false;
        document.getElementById('NON_CRIMINAL_SUBJECT_SPECIFIED').checked = false;
    }
}


// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        gPath.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        gPath.selectAll("path")
            .attr("d", path2.projection(projection));
});

var updateWarnNumber = function(wardID){
    var tempID = parseInt(wardID.split('_')[1]) - 1;
    var tempWardNumber = document.getElementById("modal2wardnumber").innerHTML = tempID+1;
}



