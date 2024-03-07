const { createLogger, transports } = require('winston');
const LokiTransport = require('winston-loki');
const axios = require('axios');

const options = {
  interval: 10,
  timeout: 1000,
  onConnectionError: err => { console.log(err) },
  transports: [
    new LokiTransport({
      host: (process.env.LOKI_URL || 'http://loki:3100')
    }),
    new transports.Console()
  ]
};
console.log(`sending logs to loki at ${JSON.stringify(options.transports[0].batcher.url)}`);

const logger = createLogger(options);

/**
 * take the request, extract the log information and send it
 *
 * curl -X GET http://localhost:30000/api/ping
 */
exports.sendLog = async (req, res) => {

  if (await lokiReady()) { // TODO: if Loki is not ready put this message to a persistent queue
    const b = req.body;
    const message = `[${b.client_ip}] - ${b.request.method} ${b.request.url} (${b.response.status}) - ${b.latencies.request} / ${b.latencies.proxy}`
    logger.info({ message: message, labels: { app: 'timetracker' } });

    res.status(200).send();
  } else {
    res.status(500).send('Loki server not reachable');
  }
};

/**
 * @returns true if loki sercer returns on endpoint /ready a http status 200
 */
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