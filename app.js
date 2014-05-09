var http = require('http');
var Q = require('q');
var express = require('express');
var states = require('./states.js');

var api_key = '9485B034A2F3CE208FCA154BEBCF349E';
var host = 'http://api.eia.gov/';

var categories = {
	electricity : 1
};

var series = {
	production : 1,
	consumption : 35
}

var server = express();
server.use(express.static(__dirname + '/public'));

var categoryurl = host + 'category/?api_key=' + api_key + '&category_id=' + categories.electricity;
getURL(categoryurl)
.then(function(resp) {
	resp = JSON.parse(resp);
	var childseries = resp.category.childseries;
	seriesurls = [];
	childseries.sort(compare);
	childseries.forEach(function(series) {
		if (series.f == 'A') {
			seriesurls.push(getURL(host + 'series/?api_key=' + api_key + '&series_id=' + series.series_id));
		}
	});
	
	return Q.all(seriesurls);
})
.then(function(resps) {
	resps.forEach(function(resp) {
		resp = JSON.parse(resp);
		if (states.iso3166.indexOf(resp.series[0].iso3166) > 0) {
			
		}
	});
})
.catch(function(err) {
	console.error(err.stack);
})
.done();

function getURL(url) {
    var deferred = Q.defer();
    var body = '';
    http.get(url, function(res) {
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            deferred.resolve(body);
        });
    }).on('error', function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

function compare(a, b) {
	var seriesA = a.name.substring(a.name.indexOf('All Fuels : '), a.name.length);
	var seriesB = b.name.substring(b.name.indexOf('All Fuels : '), b.name.length);
	if (seriesA > seriesB)
		return 1;
	else if (seriesA < seriesB)
		return -1;
	else return 0;
}

server.listen(8000);
/*
*/