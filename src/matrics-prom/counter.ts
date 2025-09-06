import client from "prom-client"

export const requestCounter = new client.Counter({
    name: "HTTP_request_counter",
    help: "HTTP request count",
    labelNames: ["method", "route", "status_code"]
})