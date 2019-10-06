require("dotenv").config();
let keys = require("./keys.js");

let Spotify = require("node-spotify-api");
let request = require('request');
let moment = require('moment');

let spotify = new Spotify(keys.spotify);

let fs = require("fs");

let nodeArguments = process.argv;

let userInput = "";
let nextUserInput = "";

for (let i = 3; i < nodeArguments.length; i++) {
    if (i > 3 && i < nodeArguments.length){ 
        userInput = userInput + "%20" + nodeArguments[i];
    }
    else {
        userInput += nodeArguments[i];
    }
    console.log(userInput);
}

for (let i = 3; i < nodeArguments.length; i++) {
    nextUserInput = userInput.replace(/%20/g, " ");
}

let command = process.argv[2];
console.log(command);
console.log(process.argv);
executeLiri();

// command liri should be running

// * `concert-this`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`

// 
// switch statements

function executeLiri() {
switch (command) {
case "concert-this":
// log
fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
if (error) {
    console.log(error);
};
});

let qURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=1e140eabdce95250b1ad6075934a113d"
request(qURL, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        let data = JSON.parse(body);
        for (let i = 0; i < data.length; i++) {
        // console.log("Venue: " + data[i].venue.name);
        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
            if (error) {
                console.log(error);
            };
        });

    if (data[i].venue.region == "") {
        console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
        fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
        if (error) {
            console.log(error);
        };
        });
        } else {
            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
        if (error) {
            console.log(error);
        };
        });
        }

        let date = data[i].datetime;
        date = moment(date).format("MM/DD/YYYY");
        console.log("Date: " + date)
        fs.appendFileSync("log.txt", "Date: " + date + "\n----------------\n", function (error) {
            if (error) {
                console.log(error);
            };
        });
console.log("----------------")
}
}
});

break;
case "spotify-this-song":

if (!userInput) {
userInput = "One";
nextUserInput = userInput.replace(/%20/g, " ");
}

fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
if (error) {
    console.log(error);
};
});
// console.log(spotify);
spotify.search({
    type: "track",
    query: userInput
}, function (err, data) {
        if (err) {
        console.log("Error occured: " + err)
}
let info = data.tracks.items
// console.log(info);

//Loop through all the "items" array
for (var i = 0; i < info.length; i++) {
let albumObject = info[i].album;
let trackName = info[i].name
let preview = info[i].preview_url
// store
let artistsInfo = albumObject.artists

for (var j = 0; j < artistsInfo.length; j++) {
    console.log("Artist: " + artistsInfo[j].name)
    console.log("Song Name: " + trackName)
    console.log("Preview of Song: " + preview)
    console.log("Album Name: " + albumObject.name)
    console.log("----------------")
    fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n----------------\n", function (error) {
        if (error) {
        console.log(error);
        };
    });
}
}
})

break;
case "movie-this":

if (!userInput) {
    userInput = "Aliens";
    nextUserInput = userInput.replace(/%20/g, " ");
}
fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
    if (error) {
    console.log(error);
    };
});

//Run request to OMDB
let queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=b8cd80e3"
request(queryURL, function (error, response, body) {
if (!error && response.statusCode === 200) {
    let info = JSON.parse(body);
    console.log("Title: " + info.Title)
    console.log("Release Year: " + info.Year)
    console.log("OMDB Rating: " + info.Ratings[0].Value)
    console.log("Rating: " + info.Ratings[1].Value)
    console.log("Country: " + info.Country)
    console.log("Language: " + info.Language)
    console.log("Plot: " + info.Plot)
    console.log("Actors: " + info.Actors)

fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRating: " +
info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
function (error) {
    if (error) {
        onsole.log(error);
    };
});
}
});
break;
}
}
