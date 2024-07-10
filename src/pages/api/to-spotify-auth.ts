import { getBaseUrl, generateRandomString } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';

/**
 * Handles the authentication process for Spotify API.
 * @example
 * handler(req, res)
 * @param {NextApiRequest} req - The NextApiRequest object.
 * @param {NextApiResponse} res - The NextApiResponse object.
 * @returns {void} Redirects the user to the Spotify authorization page.
 * @description
 *   - Establishes a connection to the database.
 *   - Generates a random state value for security purposes.
 *   - Inserts the state value into the database.
 *   - Constructs the authorization URL and redirects the user to it.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const db = new Database("./spotify_data.db", (error) => {
        console.log(error);
    });

    // PKCE auth flow does not require storage mayb
    const codeVerifier = await generateRandomString(64); 

    try {
        const baseUrl = await getBaseUrl();
        // define all the parameters
        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirect_uri = `${baseUrl}/api/exchange-for-token`; // needs to match redirect in the token exchange
        const show_dialog = 'true';
        const state = process.env.SPOTIFY_STATE;
        const scope = "user-top-read user-read-recently-played";
        
        await db.run(`INSERT INTO states (state_val) VALUES ($state)`,{
            $state: state
        }, (error) => {console.log(error)});

        const authUrl = new URL("https://accounts.spotify.com/authorize");
        authUrl.searchParams.append('client_id', client_id!);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirect_uri);
        authUrl.searchParams.append('state', state!);
        authUrl.searchParams.append('scope', scope);
        authUrl.searchParams.append('show_dialog', show_dialog);

        res.redirect(authUrl.href);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: error });
    } finally {
        if (db) {
            await db.close();
        }
    }
}