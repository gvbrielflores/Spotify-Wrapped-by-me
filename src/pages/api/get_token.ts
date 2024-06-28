import type { NextApiRequest, NextApiResponse } from "next";

/**
 * This function handles the request and response for retrieving a Spotify access token.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {string} The Spotify access token.
 * @description
 *   - This function checks if the request method is POST and returns an error if it is not.
 *   - It then uses the Spotify client ID and secret to make a POST request to the Spotify API and retrieve an access token.
 *   - The access token is then returned in the response's JSON data.
 *   - If there is an error, it is logged and an error response is returned.
 */
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

        return res.status(200).json(token); // return the token in response's json

    } catch(error) {
        console.log("Error getting token");
        return res.status(500).json({ error: "Error getting token" });
    }
}