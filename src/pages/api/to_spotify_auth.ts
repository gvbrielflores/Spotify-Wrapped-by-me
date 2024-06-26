import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // const redis = require('redis');
    // const redisClient = redis.createClient();

    // define all the parameters
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirect_uri = 'https://gabis-wrapped-ljn44e38g-gabriel-floreslovos-projects.vercel.app/';
    const show_dialog = 'true';
    const cryptoObj = require('crypto');
    const state = cryptoObj.randomBytes(20).toString('hex'); // **SUGGESTION could use uuid v4 to make this one line
    // redisClient.setex('state', 300, state);
    const scope = "user-top-read user-read-recently-played";

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.append('client_id', client_id!);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirect_uri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('show_dialog', show_dialog);

    res.redirect(authUrl.href);
}