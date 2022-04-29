"use strict";

//INITIALIZING ENVIRONMENT VARIABLES, FRAMEWORKS AND TOOLS
require('dotenv').config();

var express = require("express");
var mongoose = require("mongoose");

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var PORT = process.env.PORT || 8081;
var uri = process.env.URI;

//Connect to the database. Log error into console
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch((err) => console.log(err));

//Create the schema and model for database use
var movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	poster: {
		type: String
	}
});
const Movie = mongoose.model("Movie", movieSchema, "movies");

//Basic search. Returns ALL matching entries if no limit is given
app.get("/api/getall", (req, res) => {
	var search = bodyParameters(req);
	search.title = new RegExp(search.title); //Convert basic search into regex for partial matching
	search.limit = {limit: req.body.limit}; //Limit the number results

	Movie.find(search,null,search.limit, (err, results) => {
		if (err) {
			res.status(500).json("Internal error!");
		} else if (results.length === 0) {
			res.status(404).json("No movies found!");
		} else {
			res.status(200).json(results);
		}
	})
});

//Search by id
app.get("/api/:id", (req, res) => {
	var id = req.params.id.slice(1); //for some reason req.params.id leaves : to the beginning...

	Movie.findById(id, (err, results) => {
		if (err) {
			res.status(500).json("Internal error!");
		} else if (!results) {
			res.status(404).json("Movie not found!");
		} else {
			res.status(200).json(results);
		}
	})
});

//Add a new movie into the database
app.post("/api/add", (req, res) => {
	var details = bodyParameters(req);

	//add a placeholder image if one wasn't given
	if (!details.poster) {
		details.poster = "https://vectorified.com/images/image-placeholder-icon-7.png"
	}
	
	var newMovie = new Movie(details)
	newMovie.save()
		.then(() => { res.status(201).json("Added " + details.title + " (" + details.year + ")") })
		.catch((err) => {
			res.status(400).json("Missing movie details!");
		})
});

//Change movie details.
app.put("/api/update/:id", (req, res) => {
	var id = req.params.id.slice(1); //for some reason req.params.id leaves : to the beginning...

	var edits = bodyParameters(req);

	//Abort if edits are empty
	if (!edits.title && !edits.year && !edits.poster) {
		res.status(400).json("Missing editing details!");
		return;
	}

	Movie.findByIdAndUpdate(id, edits, (err, results) => {
		if (err) {
			res.status(500).json("Internal error!");
		} else if (!results) {
			res.status(404).json("Movie not found!");
		} else {
			res.status(200).json("Records changed successfully.");
		}
	})
});

//Delete movie by id
app.delete("/api/delete/:id", (req, res) => {
	var id = req.params.id.slice(1); //for some reason req.params.id leaves : to the beginning...

	Movie.findByIdAndDelete(id, (err, results) => {
		if (err) {
			res.status(500).json("Internal error!");
		} else if (!results) {
			res.status(404).json("Movie not found!")
		} else {
			res.status(200).json("Movie record deleted successfully.")
		}
	})
});

app.listen(PORT, () => { console.log("it werks"); });

//Helper function used to wrap body parameters into a schema-compatible object
function bodyParameters(req) {
	var movieTitle = req.body.title;
	var movieYear = req.body.year;
	var moviePoster = req.body.poster;

	var temp = {};
	if (movieTitle) temp.title = movieTitle;
	if (movieYear) temp.year = movieYear;
	if (moviePoster) temp.poster = moviePoster;

	return temp;
}