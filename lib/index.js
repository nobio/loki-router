const { createLogger, transports } = require('winston');
const LokiTransport = require('winston-loki');
const axios = require('axios');
const winston = require('winston/lib/winston/config');

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
exports.sendLog = async (req, res) => {
  if (await lokiReady()) {
    const b = req.body;
    //const message = `client_ip: ${b.client_ip}, client_url: ${b.request.url}, client_method: ${b.request.method}, started_at: ${b.started_at}, latencies: ${JSON.stringify(b.latencies)}, latencies_proxy_percent: ${b.latencies.proxy / b.latencies.request * 100}, latencies_kong_percent: ${b.latencies.kong / b.latencies.request * 100}`
    const message = `[${b.client_ip}] - ${b.request.method} ${b.request.url} (${b.response.status}) - ${b.latencies.request} / ${b.latencies.proxy}`
    logger.info({ message: message, labels: { app: 'timetracker' } });

    res.status(200).send();
  } else {
    res.status(500).send('Loki server not reachable');
  }
};

const lokiReady = async () => {
  console.log(`${process.env.LOKI_URL}/ready`);
  try {
    const lokiResp = await axios.get(`${process.env.LOKI_URL}/ready`);
    return lokiResp.status === 200;
  } catch (error) {
    console.log(error.message)
    return false;
  }
}