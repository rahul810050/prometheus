import express from "express";
import client from "prom-client";
export const router = express.Router();
router.get("/", async (req, res) => {
    console.log(client.register.contentType);
    const metrics = await client.register.metrics();
    res.set("content_type", client.register.contentType);
    res.end(metrics);
});
//# sourceMappingURL=matrics.js.map