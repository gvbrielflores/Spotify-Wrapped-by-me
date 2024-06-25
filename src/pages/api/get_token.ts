import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method != "POST") {
        return res.status(405).json({ error: "Method not allowed; not POST" });
    }

    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const url = 'https://accounts.spotify.com/api/token';
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', client_id!);
        formData.append('client_secret', client_secret!);

        const tokenRes = await fetch(url, { //tokenRes is response object
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        }) 
        const tokenJ = await tokenRes.json(); // get the json data from the response object
        const token = tokenJ.access_token; // get the access_token field from the json

        return res.status(200).json(token); //

    } catch(error) {
        console.log("Error getting token");
        return res.status(500).json({ error: "Error getting token" });
    }
}