import express from "express"
import type { Request, Response } from "express"
import client from "prom-client"

export const router = express.Router();


router.get("/matrics", async (req: Request, res: Response)=> {
    console.log(client.register.contentType);
    const metrics = await client.register.metrics();
    res.set("content_type", client.register.contentType);
    res.end(metrics);
})