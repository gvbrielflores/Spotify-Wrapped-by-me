import type { NextApiRequest, NextApiResponse } from "next";
import randomBytes from 'crypto';
import { getAuth } from "@/lib/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        
    } catch (error) {
        console.log("Error: couldn't access auth");
        return res.status(500).json({ error: "Couldn't access auth" });
    }
}


