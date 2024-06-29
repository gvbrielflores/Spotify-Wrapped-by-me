import type { NextApiRequest, NextApiResponse } from "next";
import { getBaseUrl } from "@/lib/utils";
import { Buffer } from "node:buffer";
import { Database } from 'sqlite3';
import { type } from "node:os";

/**
 * Handles the authorization process for Spotify API.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Promise} Returns a promise with the result of the authorization process.
 * @description
 *   - Checks if the state value returned matches the original state.
 *   - Retrieves the base URL for the application.
 *   - Sends a POST request to Spotify API to exchange the authorization code for access and refresh tokens.
 *   - Stores the tokens in the database.
 *   - Redirects to the wrapped page and returns a success message.
 *   - Handles errors and returns an error message.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const db = new Database('./spotify_data.db', (error) => {
            console.log(error);
        });

        const { code, state } = req.query;

        const getState = (): Promise<boolean> => { // In order to use await on non-Promise returning functions, you need
            // to wrap in a Promise handler
            return new Promise((resolve, reject) => {
                db.get(`SELECT state_val FROM states ORDER BY id DESC LIMIT 1`, 
                    function(err, row: any){
                        console.log(err);
                        if (row && row.state_val === state) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                });
            })
        }

        const keepGoing = await getState();

        if (!keepGoing) {
            console.log('Bad state');
            return res.status(300).json({ error: "State returned did not match original state" })
        }
        else {
            console.log('Good state');
        }

        const baseUrl = await getBaseUrl();

        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirect_uri = `${baseUrl}/api/exchange-for-token`;
        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code!.toString());
        formData.append('redirect_uri', redirect_uri);
        const authBuf = Buffer.from(client_id + ":" + client_secret).toString('base64');

        const tokenResponse = await fetch("https://accounts.spotify.com/api/token",{
            method: "POST",
            headers: {
                "content-type": 'application/x-www-form-urlencoded',
                "Authorization": 'Basic ' + authBuf
            },
            body : formData.toString()
        }); 

        const tokens = await tokenResponse.json();
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
        if ( accessToken === null || refreshToken === null) {
            console.log('At least one token returned null');
            return res.status(400).json({ error: 'Spotify returned at least one null token' });
        }
        // put the tokens into the database

        await db.run(`INSERT INTO tokens (token_val, refresh) VALUES ($token, $refresh)`,{
            $token: accessToken,
            $refresh: 'false'
        }, (error) => {console.log(error)});
        await db.run(`INSERT INTO tokens (token_val, refresh) VALUES ($token, $refresh)`,{
            $token: refreshToken,
            $refresh: 'true'
        }, (error) => {console.log(error)}); 
        
        res.redirect(`${baseUrl}/wrapped_page`);
        return res.status(200).json({message: "successfuly added tokens to db"});

    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: "Error: couldn't access auth" });
    }
}


