/***********************************************************************/
// Sean Leeka
// A simple Node.js app using the Express framework
//	to download, parse, analyze, and display an Apache log
//	(three most common sequentially-accessed pages, unique to IP address)
// Inspiring Apps coding challenge
// 27 June 2018
/***********************************************************************/

var express = require('express');
var http = require('http');
var path = require('path');

//Including controller/dao for testtable
var Access_Analysis = require('./routes/Access_Analysis');
var app = express();
// environment
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/Access_Analysis', Access_Analysis.table);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});