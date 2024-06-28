import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const db = new Database('spotify_data.sqlite');
        db.run(`INSERT INTO tokens VALUES
        (0, )`);

        console.log('yay');
        return res.status(200).json('yay');
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Redis operations failed" });
    }
}