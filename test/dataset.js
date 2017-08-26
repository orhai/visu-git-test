var crimes = [];
d3.json("crimes_2017.json", function (json) {
    console.log("Loading the dataset to the crimes global variable.");
	crimes = json.data;
    console.log("End of loading dataset.");
});