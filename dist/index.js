import express, {} from "express";
import client from "prom-client";
import { middleware } from "./middlewares/middleware.js";
import { router } from "./matrics.js";
const app = express();
app.use(express.json());
app.use(middleware);
app.use("/matrics", router);
app.get("/wait", async (req, res) => {
    await new Promise(s => setTimeout(s, Math.random() * 10000));
    res.send("Hello World");
});
app.post("/", (req, res) => {
    res.send("Hello post endpoint");
});
app.get("/matrics", async (req, res) => {
    console.log(client.register.contentType);
    const metrics = await client.register.metrics();
    res.set("content_type", client.register.contentType);
    res.end(metrics);
});
app.get("/slow", (req, res) => {
    for (let i = 0; i < 1000_000_000; i++) {
        Math.random();
    }
    res.send("Hello slow endpoint");
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map