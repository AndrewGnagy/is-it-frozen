"use strict";
const express = require("express");
const app = express();
const request = require("request");
const ResponseBuilder = require("./http-response-builder");

app.use('/static', express.static('static'));

app.all("/stations/:fip", (req, res) => {
  //locationid=FIPS:18&startdate=2021-01-20&enddate=2021-02-05&datatypeid=TAVG
  let now = new Date();
  let startdate = new Date();
  let yesterday = new Date();
  startdate.setDate(now.getDate() - 7);
  yesterday.setDate(now.getDate() - 1);
  let startdateStr = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + startdate.getDate();
  let yesterdayStr = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate();

  const qs = {
    locationid: req.params.fip,
    startdate: startdateStr,
    enddate: yesterdayStr,
    datatypeid: "TAVG"
  }
  const options = {
    url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?',
    method: 'GET',
    json: true,
    qs: qs,
    headers: {
      token: 'LCAQCRfRuhmMPKJBFCKpXGylmVuGHzZk'
    }
  };
  request.get(options, (err, apires, data) => {
    if (err) {
      console.log(err);
      return new ResponseBuilder(500, "Error making api call").generateResponse(res);
    } else {
      return new ResponseBuilder(apires.statusCode, data).generateResponse(res);
    }
  });
});
 
app.all("/temps/:station", (req, res) => {
  let now = new Date();
  let startdate = new Date();
  let yesterday = new Date();
  startdate.setDate(now.getDate() - 14);
  yesterday.setDate(now.getDate() - 1);
  let startdateStr = startdate.getFullYear() + "-" + (startdate.getMonth() + 1).toString().padStart(2, '0') + "-" + startdate.getDate().toString().padStart(2, '0');
  let yesterdayStr = yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1).toString().padStart(2, '0') + "-" + yesterday.getDate().toString().padStart(2, '0');

  const qs = {
    stationid: req.params.station,
    startdate: startdateStr,
    enddate: yesterdayStr,
    datatypeid: "TAVG",
    datasetid: "GHCND",
  }
  const options = {
    url: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?',
    method: 'GET',
    json: true,
    qs: qs,
    headers: {
      token: 'LCAQCRfRuhmMPKJBFCKpXGylmVuGHzZk'
    }
  };
  request.get(options, (err, apires, data) => {
    if (err) {
      console.log(err);
      return new ResponseBuilder(500, "Error making api call").generateResponse(res);
    } else {
      return new ResponseBuilder(apires.statusCode, data).generateResponse(res);
    }
  });
});

app.listen(3000, () => {
  console.log("Is it frozen started on port: 3000");
});

