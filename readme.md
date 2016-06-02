# Udacity UD811 Course Material

These are the course materials for UD811.


## Firebase Weather API

Unfortunately the Firebase Open Data Set APIs have recently been shut
down. They still return data from March 31st, but are no longer updating.

For live data, with lots more cities, try [Forecast.io](http://forecast.io/).
You'll need to register for an API key, and set up a proxy as it does not 
allow CORS requests.

There's an included proxy (forecast-io_proxy.js) that will work for local
development, but won't work when published live. 

Proxies to check out:
* https://crossorigin.me/
* https://jsonp.afeld.me/
