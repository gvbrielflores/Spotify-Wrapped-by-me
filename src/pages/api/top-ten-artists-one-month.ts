import { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';
import { getBaseUrl } from "@/lib/utils";
import { get } from "http";

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
    const db = new Database('./spotify_data.db');
    let authToken: any;

    const getDbToken = (): Promise<boolean> => {
        return new Promise ((resolve, reject) => {
                db.get(`SELECT token_val FROM tokens WHERE refresh IS 'false' ORDER BY id DESC LIMIT 1`,
                    function (err, row: any) {
                        if(row !== undefined) {
                            authToken = row.token_val;
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    }
                );
            })
        }

    const keepGoing = await getDbToken();

    if (!keepGoing) {
        console.log('Token does not exist');
        return res.status(300).json({error: "There was no auth token value"});
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
                'Authorization': 'Bearer ' + authToken
            }
        })

        const artistsJson = await artistResponse.json();
        console.log(artistsJson);
        return res.status(200).json(artistsJson.items);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: "Spotify error" });
    } finally {
        if (db) {
            await db.close();
        }
    }
}