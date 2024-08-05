import type { NextApiRequest, NextApiResponse } from "next";
import { getBaseUrl } from "@/lib/utils";
import { Buffer } from "node:buffer";
import { setCookie } from '@/lib/cookie';

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
        const { code, state } = req.query;

        if (!(state === process.env.SPOTIFY_STATE)) {
            console.log('Bad state');
            return res.status(400).json({ error: "State returned did not match original state" })
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

        const tokenData = await tokenResponse.json(); /* You can only retrieve the json body of a response once;
        So if you need to get multiple variables from it, save the json in a holder variable */
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;

        if ( accessToken === null || refreshToken === null) {
            console.error('At least one token returned null');
            return res.status(401).json({ error: 'Spotify returned at least one null token' });
        }

        // Put the tokens into cookies
        await setCookie(res, 'access_token', accessToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production', 
            path: '/', maxAge: 60 * 60 });
        await setCookie(res, 'refresh_token', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production',
            path: '/', maxAge: 60 * 60 * 24 * 2 });
        res.redirect(`${baseUrl}/wrapped_page`);
        return res.status(200).json({message: "Successfuly added tokens to cookies"});

    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ error: `Error exchanging for tokens: ${error}` });
    }
}