var express = require('express');
var request = require('request');

var router = express.Router();

router.get("/results",function(req, res){
    var randomNum = -1;

    // Randomize url to prevent caching of url for api
    randomNum = Math.floor(Math.random() * (9999999 -1000 + 1)) + 1000;

    var url = "https://api.audd.io/?url=" + "https://secret-beyond-86077.herokuapp.com/music?" + randomNum + "&return=lyrics"


    request(url, function(error,response,body){
        var data=JSON.parse(body);
        if(data.status == "error") {
            res.render("error") ;
        }
        else {
            res.render("results",{data: data});
        }
    });

});

module.exports = router;
