import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {  }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Server error when catching auth" });
    }
}