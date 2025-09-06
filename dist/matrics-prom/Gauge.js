import client from "prom-client";
export const activeRequests = new client.Gauge({
    name: "http_active_request",
    help: "Number of active requests"
});
//# sourceMappingURL=Gauge.js.map