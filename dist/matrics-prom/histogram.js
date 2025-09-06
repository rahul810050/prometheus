import client from "prom-client";
export const httpResponseDuration = new client.Histogram({
    name: "http_requests_response",
    help: "http requests time durations",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 5, 50, 100, 200, 300, 500, 700, 900, 1500, Infinity]
});
//# sourceMappingURL=histogram.js.map