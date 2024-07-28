'use client';

import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
        <div className='flex flex-col '>
            <div className="flex flex-row justify-center">
                <Button onClick={topTenArtists}> top ten artists for one month! </Button>
            </div>
            <div className="flex flex-row justify-center">
                {(artistsData.length > 0 ) &&
                    <ul>
                        {artistsData.map((artist: any, index: number) => (
                            <li key={index}>
                                {`${index+1}. ${artist.name}`}
                            </li>
                        ))}
                    </ul>
                }
            </div>
            <div className="flex flex-row justify-center">
                {(artistsData.length > 0 ) && 
                (
                <BarChart width={700} height={250} data={artistsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="followers.total" fill="#8884d8" name='Follower Counts'/>
                </BarChart>
                )}
            </div>
        </div>
    )
}

export default GetTopStats;