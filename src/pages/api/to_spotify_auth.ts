import { getBaseUrl } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const db = new Database("./spotify_data.db", (error) => {
        console.log(error);
    });
    const baseUrl = await getBaseUrl();
    console.log(baseUrl);
    // define all the parameters
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirect_uri = `${baseUrl}/api/exchange_for_token`; // needs to match redirect in the token exchange
    console.log(redirect_uri);
    const show_dialog = 'true';
    const cryptoObj = require('crypto');
    const state = cryptoObj.randomBytes(20).toString('hex'); // **SUGGESTION could use uuid v4 to make this one line
    const scope = "user-top-read user-read-recently-played";
    
    await db.run(`INSERT INTO states (state_val) VALUES ($state)`,{
        $state: state
    }, (error) => {console.log(error)});

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append('client_id', client_id!);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirect_uri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('show_dialog', show_dialog);

    res.redirect(authUrl.href);
}