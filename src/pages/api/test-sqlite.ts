import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cryptoObj = require('crypto');
    const state = cryptoObj.randomBytes(20).toString('hex')
    console.log(state)
    return res.status(200);
}