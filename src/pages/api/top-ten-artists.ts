import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "@/lib/cookie";

/**
 * Handles the request and response for retrieving a user's top 10 short-term artists from Spotify.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The NextApiRequest object containing the request data.
 * @param {NextApiResponse} res - The NextApiResponse object used to send the response.
 * @returns {Promise} A promise that resolves to the top 10 short-term artists in JSON format.
 * @description
 *   - Checks for the presence of an access token in the request cookie.
 *   - If no access token is found, returns a 400 error with a message.
 *   - If an access token is found, makes a request to the Spotify API for the user's top 10 short-term artists.
 *   - Returns a 200 response with the top 10 short-term artists in JSON format.
 *   - If an error occurs, returns a 500 error with a message.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { desiredInterval } = req.query;

        if (desiredInterval !== 'short_term' && desiredInterval !== 'medium_term' && desiredInterval !== 'long_term') {
            console.error('Invalid interval for top ten');
            return res.status(400).json({ error: "Invalid interval for top ten"});
        }
    
        const accessToken = getCookie(req, "access_token");

        if (accessToken === undefined) {
            console.error('Token does not exist');
            return res.status(400).json({error: "There was no access token value"});
        }
        else {
            console.log("Token exists");
        }

        const reqUrl = new URL("https://api.spotify.com/v1/me/top/artists");
        reqUrl.searchParams.append('time_range', desiredInterval);
        reqUrl.searchParams.append('limit', '10');
        reqUrl.searchParams.append('offset', '0');

        const artistResponse = await fetch(reqUrl, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })

        const artistsJson = await artistResponse.json();
        console.log(typeof artistsJson.items, artistsJson.items);
        return res.status(200).json(artistsJson.items);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Spotify error" });
    }
}