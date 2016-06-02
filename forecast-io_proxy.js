'use strict';

var http = require('http');
var https = require('https');

var port = 9800;
var forecastIOKey = 'PUT_FORECAST_IO_API_KEY_HERE';
var cachedForecasts = {};

var cityToLatLon = {
  'austin': '30.3079823,-97.8938293',
  'boston': '42.313479,-71.1273685',
  'chicago': '41.8339032,-87.8725822',
  'bangalore': '12.9539598,77.4905096',
  'buenosaires': '-34.6158036,-58.5035321',
  'capetown': '-33.9137107,18.0942365',
  'london': '51.5285578,-0.2420244',
  'mcmurdo': '-77.8401137,166.6441437',
  'newyork': '40.7128,-74.0059',
  'portland': '45.5425909,-122.7948484',
  'sanfrancisco': '37.7578149,-122.5078116',
  'seattle': '47.6149938,-122.4763319',
  'sydney': '-33.7966053,150.6415579',
  'tokyo': '35.6732615,139.5699601'
};

function handleRequest(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  var cityName = request.url.substring(1).replace('.json', '');
  var cityCoords = cityToLatLon[cityName];
  if (!cityCoords) {
    response.statusCode = 404;
    response.end();
    console.log('404  ', request.url);
    return;
  }
  console.log('REQ  ', request.url);
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('X-Powered-By', 'fIO.proxy');
  var cachedForecast = cachedForecasts[cityName];
  if (cachedForecast && Date.now() < cachedForecast.expiresAt) {
    response.end(JSON.stringify(cachedForecast));
    console.log('RESP ', cityName, '[cache]');
  } else {
    getForecast(cityCoords, function(freshForecast) {
      response.end(freshForecast);
      var forecast = JSON.parse(freshForecast);
      forecast.expiresAt = Date.now() + (1000 * 60);
      cachedForecasts[cityName] = forecast; 
      console.log('RESP ', cityName, '[network]');     
    });
  }
}

function getForecast(coords, callback) {
  var options = {
    host: 'api.forecast.io',
    path: '/forecast/' + forecastIOKey + '/' + coords
  };
  https.request(options, function(response) {
    var resp = '';
    response.on('data', function(chunk) {
      resp += chunk;
    });
    response.on('end', function() {
      if (callback) {
        callback(resp);
      }
    });
  }).end();
}

var httpServer = http.createServer(handleRequest);

httpServer.listen(port, function() {
  console.log('Forecast.io proxy server started...', port);
});
