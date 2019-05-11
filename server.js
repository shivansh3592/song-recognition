var express = require('express');
var request = require('request');


var resultsRoutes = require("./routes/results");

const fileUpload = require('express-fileupload');
var app = express();

app.use(fileUpload());

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get("/",function(req, res) {
    res.render("index");
});

app.post('/upload', function(req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field used to retrieve the uploaded file
    let audiodata = req.files.audiodata;
    //  mv() method to place the file somewhere on server
    audiodata.mv('views/upload/audio.ogg', function(err) {
        if (err) {
            console.log("here");
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

app.get('/music',function(req,res) {
    res.sendFile(__dirname + '/views/upload/audio.ogg')
});

app.use(resultsRoutes);

app.listen(process.env.PORT || 8080, process.env.ID, function() {
    console.log("server started");
});
