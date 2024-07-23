'use client';

import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";
import { useState } from "react";

const GetTopStats = () => {
    const [artistsData, setArtists] = useState([]);

    const topTenArtists = async () => {
        const res = await topTenArtistsOneMonth();
        console.log(res.status);
        if (res.ok) {
            const data = await res.json();
            setArtists(data);
        } else {
            console.error('Failed to fetch artists');
            return [];
        }
    }

    return (
        <div className='flex flex-col justify-items'>
            <div>
                <Button onClick={topTenArtists}> top ten artists for one month! </Button>
            </div>
            <div>
                {(artistsData.length > 0 ) &&
                    <ul>
                        {artistsData.map((artist: any, index: number) => (
                            <li key={index}>
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