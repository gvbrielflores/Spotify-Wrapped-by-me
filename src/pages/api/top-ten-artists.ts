import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "@/lib/cookie";
import { getBaseUrl } from "@/lib/utils";

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
        const { interval, dataType } = req.query;
        if (interval !== 'short_term' && interval !== 'medium_term' && interval !== 'long_term') {
            console.error('API: Invalid interval for top ten');
            return res.status(400).json({ error: "Invalid interval for top ten"});
        }
    
        const accessToken = getCookie(req, "access_token");

        if (accessToken === undefined) {
            console.error('Access token does not exist');
            const goRefresh = new URL('/api/refresh-access-token',await getBaseUrl());
            goRefresh.searchParams.append('interval', interval);
            res.redirect(302, goRefresh.toString());
        }
        else {
            console.log("Token exists");
        }

        const reqUrl = new URL(`https://api.spotify.com/v1/me/top/${dataType}`);
        reqUrl.searchParams.append('time_range', interval);
        reqUrl.searchParams.append('limit', '10');
        reqUrl.searchParams.append('offset', '0');

        const artistResponse = await fetch(reqUrl, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })

        const artistsJson = await artistResponse.json();
        
        if (typeof artistsJson.error === 'undefined') {
            return res.status(200).json(artistsJson.items);
        }
        else {
            console.error(`${dataType} Json returned from Spotify: `,artistsJson);
            return res.status(402).json({error: 'Spotify response was undefined'});
        }
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: `Server error getting top ten artists: ${error}` });
    }
}