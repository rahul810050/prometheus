import type { Request, Response, NextFunction } from "express";
import { activeRequests } from "../matrics-prom/Gauge.js";
import { requestCounter } from "../matrics-prom/counter.js";
import { httpResponseDuration } from "../matrics-prom/histogram.js";



export function middleware(req: Request, res: Response, next: NextFunction){
    const timebeforeRes = Date.now();
    activeRequests.inc();
    res.on("finish", ()=> { // this is a event listener that is triggered when the response is finished
        const timeafterRes = Date.now();
        const duration = timeafterRes - timebeforeRes;
        console.log(`time taken ${duration} ms`);

        // Increasing the Counter
        requestCounter.inc({
            method: req.method,
            route: req.url,
            status_code: res.statusCode
        })

        httpResponseDuration.observe({
            method: req.method,
            status_code: res.statusCode,
            route: req.url
        }, duration);

        activeRequests.dec();
    })
    next();
    // const timeafterRes = new Date();
    // console.log(`time taken ${timeafterRes - timebeforeRes} ms. the method is ${req.method} and the endpoint is ${req.url}`)
}