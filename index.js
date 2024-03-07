// configure from .env
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const lib = require('./lib');

const app = express();
app.set('host', process.env.IP || '0.0.0.0');
app.set('port', process.env.PORT || '30500');
app.set('ssl-port', process.env.SSL_PORT || '30501');

const sslOptions = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem'),
};

app.use(express.json());
app.use(cors());

// .......................................................................
// API Service
// .......................................................................
app.post('/api/log', lib.sendLog);

// .......................................................................
// Default error handler
// .......................................................................
app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called");
  console.log('Path: ', req.path);
  console.log(error);
  next() // (optional) invoking next middleware
})
/* ================= start the web service on http ================= */
http.createServer(app).listen(app.get('port'), app.get('host'), () => {
  console.log(`loki-router listening on http://${app.get('host')}:${app.get('port')}`);
});

/* ================= start the web service on https ================= */
https.createServer(sslOptions, app).listen(app.get('ssl-port'), app.get('host'), () => {
  console.log(`loki-router listening on https://${app.get('host')}:${app.get('ssl-port')}`);
});
