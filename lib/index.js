const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  interval: 10,
  transports: [
    new LokiTransport({
      host: process.env.LOKI_URL
    })
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
  const message = `client_ip: ${b.client_ip}, client_url: ${b.request.url}, client_method: ${b.request.method}, started_at: ${b.started_at}, latencies: ${JSON.stringify(b.latencies)}, latencies_proxy_percent: ${b.latencies.proxy/b.latencies.request * 100}, latencies_kong_percent: ${b.latencies.kong/b.latencies.request * 100}`
  console.log(message);
  logger.debug({message: message, labels: {app: 'timetracker'}});

  res.status(200).send();
};
