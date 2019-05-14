/***********************************************************************/
// Sean Leeka
// A simple Node.js app using the Express framework
//	to download, parse, analyze, and display an Apache log
//	(three most common sequentially-accessed pages, unique to IP address)
// Inspiring Apps coding challenge
// 27 June 2018
/***********************************************************************/

exports.table = function(request, response){
	var clf_parser 	= require('clf-parser/index'); //common log file (Apache/nginx) parser
	var fs 			= require('fs');
	var http		= require('http');

	const IA_Apache_log_url = 
"http://dev.inspiringapps.com/Files/IAChallenge/30E02AAA-B947-4D4B-8FB6-9C57C43872A9/Apache.log";

	var	IA_log_destination = "Apache.log";

	function download(url, dest, callback) {
	    var file = fs.createWriteStream(dest);
	    var request = http.get(url, function (response) {
	        response.pipe(file);
	        file.on('finish', function () {
	            file.close(callback); // close() is async, call callback after close completes.
	        });
	        file.on('error', function (err) {
	            fs.unlink(dest); // Delete the file async. (But we don't check the result)
	            if (callback)
	                callback(err.message);
	        });
	    });
	}

	download(IA_Apache_log_url, IA_log_destination, function(err){
		if (err){
			throw err;
		}
		else {
			console.log("IA challenge Apache log downloaded from:\n"+IA_Apache_log_url);
			parseFile();
		}
	});

	var parseFile = function(){
		var data = 
			fs.readFileSync('Apache.log', 'utf8')
			.split('\n')
			.map(function(line) {
				if (line === "") { return; }	//account for new/blank lines
				//I still occasionally see a bug where the file is opened for reading before it finishes closing
				//so I added the .5sec sleep above
				
				var parsed = clf_parser(line);
				return {
					ip: parsed.remote_addr,
			 		request: parsed.request.split(' ')[1]
				};
			})
			//handle blank or newlines, especially at end of file
			.filter(function(n) { return n != undefined });

		var pages = {};
		//iterate across log and find two subsequent pages for each unique IP
		for (i=0; i<data.length; i++)
		{
			//first page accessed
			var three_page_sequence = [data[i].request];
			//find two subsequent pages accessed by the same IP
			for (j=i+1; j<data.length; j++)
			{
				//our unique user's IP address
				if (data[j].ip == data[i].ip)
				{
					three_page_sequence.push(data[j].request);
				}
				//we've found a sequence of three; add to the pages dictionary
				//user IP is the key, count is value
				if (three_page_sequence.length == 3)
				{
					if (!(three_page_sequence in pages))
					{
						pages[three_page_sequence] = 1;
					}
					else
					{
						pages[three_page_sequence] += 1;
					}
					break;
				}
			}
		}

		//convert the dictionary to an array so it may be sorted later
		var pages_array = Object.keys(pages).map(function(key) {
			var three_pages = key.split(',');
			return [three_pages[0], three_pages[1], three_pages[2], pages[key]];
		});

		//sort the array by decending order
		pages_array.sort(function(first, second) {
			return second[3] - first[3];
		});
		
		response.render('Access_Analysis', {page_title:"Most accessed three-page sequences", data:pages_array});
		// console.log(pages_array);
	};
}
