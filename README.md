# loki-router

Service that provides an http interface to receive log information from another application (like kong using the http plugin). It will send this message in the expected format to a loki instance which itself can be integrated into Grafana