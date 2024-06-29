import { NextApiRequest, NextApiResponse } from "next";
import { Database } from 'sqlite3';
import { getBaseUrl } from "@/lib/utils";
import { get } from "http";

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
    console.log(authToken);

    if (!keepGoing) {
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
    }
}