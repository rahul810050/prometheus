const express = require("express");
const client = require("prom-client");


function middleware(req, res, next){
    const timebeforeRes = new Date();
    activeRequests.inc();
    res.on("finish", ()=> { // this is a event listener that is triggered when the response is finished
        const timeafterRes = new Date();
        console.log(`time taken ${timeafterRes - timebeforeRes} ms`);

        // Increasing the Counter
        requestCounter.inc({
            method: req.method,
            status_code: res.statusCode,
            endpoint: req.url
        })

        httpRequestDuration.observe({
            method: req.method,
            status_code: res.statusCode,
            routes: req.url
        }, timeafterRes - timebeforeRes);

        activeRequests.dec();
    })
    next();
    // const timeafterRes = new Date();
    // console.log(`time taken ${timeafterRes - timebeforeRes} ms. the method is ${req.method} and the endpoint is ${req.url}`)
}

const requestCounter = new client.Counter({
    name: "http_request_count",
    help: "the total number of requests",
    labelNames: ["method", "status_code", "endpoint"]
})

const activeRequests = new client.Gauge({
    name: "active_requests",
    help: "the number of active requests"
})

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration",
    help: "the duration of the http request",
    labelNames: ["method", "status_code", "routes"],
    buckets: [0.1,5,50,100,200,300,500,1500]
})

const app = express();

app.use(express.json());

app.use(middleware);

app.get("/", async (req, res) => {
    await new Promise(s=> setTimeout(s, Math.random() * 10000));
    res.send("Hello World");
});


app.post("/", (req, res)=> {
    res.send("Hello post endpoint");
})

app.get("/slow", (req, res)=> {
    for(let i = 0; i < 1000_000_000; i++) {
        Math.random();
    }
    res.send("Hello slow endpoint");
})

app.get("/metrics", async (req, res)=> {
    console.log(client.register.contentType);
    const metrics = await client.register.metrics();
    res.set("content_type", client.register.contentType);
    res.end(metrics);
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});