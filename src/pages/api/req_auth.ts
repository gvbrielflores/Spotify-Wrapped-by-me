import type { NextApiRequest, NextApiResponse } from "next";
import randomBytes from 'crypto';
import { getAuth } from "@/lib/utils";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const redirect_uri = 'gabis-wrapped-ljn44e38g-gabriel-floreslovos-projects.vercel.app/wrapped_page';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        console.log(client_id);
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirect_uri = 'http://localhost:3000/wrapped_page';
        const baseurl = "https://accounts.spotify.com/authorize?";

        const cryptoObj = require('crypto')
        const state = cryptoObj.randomBytes(20).toString('hex');
        const scope = "user-top-read user-read-recently-played";

        const querystring = require('querystring');
        const queryParams = {
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }

        const url = `${baseurl}${querystring.stringify(queryParams)}`;

        const spotifyResponse = await fetch(url).catch( error => {
            console.log("Error:",error);
        });

        const tmp = await spotifyResponse!.json();
        return res.status(200).json(tmp);

    } catch (error) {
        console.log("Error: couldn't access auth");
        return res.status(500).json({ error: "Couldn't access auth" });
    }


}


