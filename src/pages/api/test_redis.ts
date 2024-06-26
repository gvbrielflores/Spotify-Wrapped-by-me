import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from 'redis';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const redis = require('redis');
        const redisClient = redis.createClient();
        redisClient.on('error', (err: Error) => {
            console.error('Redis client error', err)
            return res.status(500).json({ error: "Redis internal server error" });
        });

        
        console.log('yay');
        return res.status(200).json('yay');
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Redis operations failed" });
    }
}