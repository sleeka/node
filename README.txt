/***********************************************************************/
// Sean Leeka
// A simple Node.js app using the Express framework
//	to download, parse, analyze, and display an Apache log
//	(three most common sequentially-accessed pages, unique to IP address)
//  coding challenge
// 27 June 2018
/***********************************************************************/

Installation:
1) In this root directory: "npm install"

Execution:
1) Within this directory: "nodejs app.js"
2) In a web browser: "http://localhost:4300/Access_Analysis"

Notes:
1) './routes/Access_Analysis.js': Most of the work; download, parse, analyze, and send data to the view
2) './app.js': The app is started and environment is defined
3) './views/Access_Analysis.ejs': The HTML table is defined
4) './package.json': Dependencies ('node-clf-parser' to parse the Apache log; 'express' web framework; 'ejs' uses <% %> within HTML and compiles the Express view system).
