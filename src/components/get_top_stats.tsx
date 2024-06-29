'use client';

import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";
import { useState } from "react";

const GetTopStats = () => {
    const [artists, setArtists] = useState([]);

    const topTenArtists = async () => {
        const res = await topTenArtistsOneMonth();

        if (res.ok) {
            const data = await res.json();
            setArtists(data);
        } else {
            console.error('Failed to fetch artists');
            return [];
        }
    }

    return (
        <div>
            <div>
                <Button onClick={topTenArtists}> top ten artists for one month! </Button>
            </div>
            <div>
                {(artists.length > 0 ) &&
                    <ul>
                        {artists.map((artist: any, index: number) => (
                            <li>
                                {artist.name}
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>
    )
}

export default GetTopStats;