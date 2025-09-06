import { activeRequests } from "./Gauge.js";
import { requestCounter } from "./counter.js";
import { httpResponseDuration } from "./histogram.js";
export function middleware(req, res, next) {
    const timebeforeRes = Date.now();
    activeRequests.inc();
    res.on("finish", () => {
        const timeafterRes = Date.now();
        const duration = timeafterRes - timebeforeRes;
        console.log(`time taken ${duration} ms`);
        // Increasing the Counter
        requestCounter.inc({
            method: req.method,
            route: req.url,
            status_code: res.statusCode
        });
        httpResponseDuration.observe({
            method: req.method,
            status_code: res.statusCode,
            route: req.url
        }, duration);
        activeRequests.dec();
    });
    next();
    // const timeafterRes = new Date();
    // console.log(`time taken ${timeafterRes - timebeforeRes} ms. the method is ${req.method} and the endpoint is ${req.url}`)
}
//# sourceMappingURL=middleware.js.map