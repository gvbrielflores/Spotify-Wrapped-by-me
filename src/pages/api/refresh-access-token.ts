import { getCookie, setCookie } from "@/lib/cookie";
import { getBaseUrl } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { interval } = req.query;
        if (interval !== 'short_term' && interval !== 'medium_term' && interval !== 'long_term') {
            console.error('API: Invalid interval for top ten');
            return res.status(400).json({ error: "Invalid interval for top ten"});
        }

        const baseUrl = await getBaseUrl();
        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
        const authBuf = Buffer.from(client_id + ":" + client_secret).toString('base64');

        const refreshToken = getCookie(req, 'refresh_token');
        if (refreshToken) {
            const refreshBody = new URLSearchParams();
            refreshBody.append('grant_type','refresh_token');
            refreshBody.append('refresh_token', refreshToken);

            const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + authBuf
                },
                body: refreshBody.toString()
            });
    
            const responseData = await refreshResponse.json();
            if (!refreshResponse.ok) {
                console.error("Refresh response from spotify: ",responseData);
                return res.status(refreshResponse.status).json({error: responseData.error.message});
            }

            const accessToken = responseData.access_token;
    
            await setCookie(res, 'access_token', accessToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production', 
                path: '/', maxAge: 60 * 60 });
    
            const callTopTenArtists = new URL('/api/top-ten-artists',baseUrl);
            callTopTenArtists.searchParams.append('interval', interval);
            console.log('redirect to topten');
            res.redirect(callTopTenArtists.toString());
        }
        else { // If refresh token doesn't exist, redirect user to login page to re-authorize
            res.redirect(302,`${baseUrl}/`);
            /* Note: this api is called as part of a chain starting with top ten artists. Thus, this redirect actually 
            returns to the function that called the original api; as it is expecting a return. It seems like
            res.redirect returns a 200 status and two other fields: redirected = true and url=<url returned>
            I did not know that a http response had those attributes. */
        }
    } catch (error) {
        console.error("There was an error refreshing access token: ", error);
        return res.status(500).json({ error: `There was an error refreshing access token: ${error}` });
    }
}