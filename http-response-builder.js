"use strict";

module.exports = class HttpResponseBuilder {
  constructor(statusCode, body, headers = {}) {
    this.statusCode = statusCode;
    this.body = body;
    this.headers = Object.assign(
      {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      headers
    );
  }

  generateResponse(res) {
    res.status(this.statusCode);
    //updating headers to not lose existing ones (like corrId)
    this.headers = Object.assign(this.headers, res.getHeaders());

    res.set(this.headers);
    res.json(this.body);
  }
};
