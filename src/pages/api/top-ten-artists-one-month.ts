import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { Database } from 'sqlite3';
import { getBaseUrl } from "@/lib/utils";
import { get } from "http";
import { getCookie } from "@/lib/cookie";

/**
 * Retrieves the top 10 short-term artists for the current user from the Spotify API.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object from Next.js.
 * @param {NextApiResponse} res - The response object from Next.js.
 * @returns {Promise} A promise that resolves to an array of the top 10 short-term artists for the current user.
 * @description
 *   - Checks the database for a valid auth token.
 *   - If no token is found, returns an error response.
 *   - If a token is found, makes a request to the Spotify API and returns the top 10 short-term artists.
 *   - If there is an error, returns a 500 error response.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const accessToken = getCookie(req, "access_token");

    if (accessToken === undefined) {
        console.log('Token does not exist');
        return res.status(300).json({error: "There was no access token value"});
    }
    else {
        console.log("Token exists");
    }

    const reqUrl = new URL("https://api.spotify.com/v1/me/top/artists");
    reqUrl.searchParams.append('time_range', 'short_term');
    reqUrl.searchParams.append('limit', '10');
    reqUrl.searchParams.append('offset', '0');

    try {
        const artistResponse = await fetch(reqUrl,{
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })

        const artistsJson = await artistResponse.json();
        console.log(artistsJson.items);
        return res.status(200).json(artistsJson.items);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Spotify error" });
    }
}