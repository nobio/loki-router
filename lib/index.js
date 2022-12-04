const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const winston = require("winston/lib/winston/config");

const options = {
  interval: 10,
  timeout: 1000,
  onConnectionError: err => { console.log(err) },
  transports: [
    new LokiTransport({
      host: process.env.LOKI_URL
    }),
    new transports.Console()
  ]
};

const logger = createLogger(options);

/**
 * take the request, extract the log information and send it
 *
 * curl -X GET http://localhost:30000/api/ping
 */
exports.sendLog = (req, res) => {
  const b = req.body;
  //const message = `client_ip: ${b.client_ip}, client_url: ${b.request.url}, client_method: ${b.request.method}, started_at: ${b.started_at}, latencies: ${JSON.stringify(b.latencies)}, latencies_proxy_percent: ${b.latencies.proxy / b.latencies.request * 100}, latencies_kong_percent: ${b.latencies.kong / b.latencies.request * 100}`
  const message = `${b.client_ip} - ${b.request.method} ${b.request.url} - ${b.latencies.request}`
  logger.info({ message: message, labels: { app: 'timetracker' } });

  res.status(200).send();
};
