var keys = require('./keys.js');
var Twitter = require('twitter');
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var inputs = process.argv;
var searchTerm = "";


for (let i = 3; i < inputs.length; i++) {
    searchTerm = searchTerm + inputs[i] + " ";
}
var newSearch = searchTerm.trim();

function getTweets() {
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var params = {
        'count': 1,
    }

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        } else {
            var str = JSON.stringify(tweets, null, 2);
            for (var i = 0; i < tweets.length; i++) {
                console.log("-");
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                console.log("-");
            }
        }
    });
}

function getSpotify() {
    var spotify = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret
    });

    var songInput = newSearch;

    if (songInput === "") {
        songInput = "the sign ace of base";

    }
    spotify.search({ type: 'track', query: songInput, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error:  ' + err);
        }
        var bandName = data.tracks.items[0].album.artists[0].name;
        var albumName = data.tracks.items[0].album.name;
        var songName = data.tracks.items[0].name;
        var preview = data.tracks.items[0].preview_url;

        console.log("Artist:       " + bandName);
        console.log("Album:        " + albumName);
        console.log("Preview:      " + preview);
        console.log("Name of Song: " + songName);
    });
}

function getMovie() {
    var movieInput = newSearch.replace(" ", "+");
    if (newSearch === "") {
        movieInput = "Mr. Nobody";
    }
    var movieSearch = movieInput.replace(/\./g, ' ');
    var query = "http://www.omdbapi.com/?apikey=40e9cece&r=json&t=" + movieSearch;
    request(query, function(error, response, body) {
        if (!error) {
            var movieObject = JSON.parse(body);
            var movieTitle = movieObject.Title;
            console.log("Title:         " + movieTitle);
            var year = movieObject.Year;
            console.log("Year:          " + year);
            var rating = movieObject.Ratings[0].Value;
            console.log("IMDB rating:   " + rating);
            var country = movieObject.Country;
            console.log("Country:       " + country);
            var language = movieObject.Language;
            console.log("Language:      " + language);
            var plot = movieObject.Plot;
            console.log("Plot:          " + plot);
            var actors = movieObject.Actors;
            console.log("Actors:        " + actors);
        } else if (err) {
            console.log("Error:   " + err);
        }
    });
}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        newSearch = dataArr[1];

        switch (command) {
            case "my-tweets":
                getTweets();
                break;
            case "spotify-this-song":
                getSpotify();
                break;
            case "movie-this":
                getMovie();
                break;
            default:
                console.log("Enter a valid command");
        }
    });
}

switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        getSpotify();
        break;
    case "movie-this":
        getMovie();
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        console.log("Enter a valid command");
}
