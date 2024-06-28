import type { NextApiRequest, NextApiResponse } from "next";
import randomBytes from 'crypto';
import { getAuth } from "@/lib/utils";
import { Buffer } from "node:buffer";
import { Database } from 'sqlite3';

/**
 * Handles the authorization process for Spotify API.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {Object} Returns a JSON object with a success message.
 * @description
 *   - Uses the provided code and state to exchange for access and refresh tokens.
 *   - Inserts the tokens into a database for future use.
 *   - Returns a success message upon completion.
 *   - Throws an error if there is an issue with the authorization process.
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

        let keepGoing: boolean = true;

        const stateRow = await db.get(`SELECT state_val FROM states ORDER BY id DESC LIMIT 1`, 
            function(err, row){
                console.log(err);
                if (row == state) {
                    keepGoing = true;
                }
                else {
                    keepGoing = false;
                }
        });

        if (!keepGoing) {
            return res.status(300).json({ error: "State returned did not match original state" })
        }
        else {
            console.log("Good state");
        }

        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirect_uri = 'http://localhost:3000/api/exchange_for_token';
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
        // put the tokens into the database

        await db.run(`INSERT INTO tokens (token_val, refresh) VALUES ($token, $refresh)`,{
            $token: accessToken,
            $refresh: 'false'
        }, (error) => {console.log(error)});
        await db.run(`INSERT INTO tokens (token_val, refresh) VALUES ($token, $refresh)`,{
            $token: refreshToken,
            $refresh: 'true'
        }, (error) => {console.log(error)}); 
        
        
        return res.status(200).json({message: "successfuly added tokens to db"});
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ error: "Error: couldn't access auth" });
    }
}


