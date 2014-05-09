var http = require('http');
var Q = require('q');
var states = require('states.js');

var api_key = '9485B034A2F3CE208FCA154BEBCF349E';
var host = 'http://api.eia.gov/';

var categories = {
	electricity : 1
};

var series = {
	production : 1,
	consumption : 35
}

var categoryurl = host + 'category/?api_key=' + api_key + '&category_id=' + categories.electricity;
getURL(categoryurl)
.then(function(resp) {
	resp = JSON.parse(resp);
	var childseries = resp.category.childseries;
	seriesnames = [];
	childseries.sort(compare);
	childseries.forEach(function(series) {
		if (series.f == 'A') {
			seriesnames.push(series.name);
		}
	});

	seriesnames.forEach(function(name) {
		var deferred = Q.defer();
		var seriesurl = host + 'series/?api_key' + api_key + '&series_id=' + name;

	})
})
.catch(function(err) {
	console.error(err);
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