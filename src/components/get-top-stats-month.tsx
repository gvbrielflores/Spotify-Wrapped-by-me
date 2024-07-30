'use client';

import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ChildProps {
    setParentVisible: () => void;
}

/**
 * Component that displays the top ten artists for one month and their corresponding follower count in a bar chart.
 * @component
 * @example
 *   <TopTenArtists prop1={sample_value1} prop2={sample_value2} />
 * @prop {Function} setParentVisible - Function to set the visibility of the parent component.
 * @description
 *   - Uses useState hook to manage state variables for artistsData, resetVisible, and onlyParentVisible.
 *   - Calls topTenArtistsOneMonth function to fetch data for top ten artists.
 *   - Uses handleGetStats function to handle button click and display data and bar chart.
 *   - Uses handleReset function to handle button click and reset component to initial state.
 *   - Renders a button to display top ten artists and a button to reset the component.
 */
const GetTopStatsMonth = ({setParentVisible}: ChildProps) => {
    const [artistsData, setArtists] = useState([]);
    const [resetVisible, setResetVisible] = useState(false);
    const [onlyParentVisible, setOnlyParent] = useState(false);

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

    const handleGetStats = async () => {
        await topTenArtists();
        await setParentVisible();
        setResetVisible(!resetVisible);
    }

    const handleReset = async () => {
        await setParentVisible();
        setResetVisible(!resetVisible);
        setOnlyParent(!onlyParentVisible);
    }

    return (
        <div className='flex flex-col'>
            {!onlyParentVisible && !resetVisible && (<div className="flex flex-row justify-center">
                <Button onClick={handleGetStats}> top ten artists for one month! </Button>
            </div>)}
            {(artistsData.length > 0 ) && !onlyParentVisible && <div className="flex flex-row justify-center">
                <ul>
                    {artistsData.map((artist: any, index: number) => (
                        <li key={index}>
                            {`${index+1}. ${artist.name}`}
                        </li>
                    ))}
                </ul>
            </div>}
            {(artistsData.length > 0 ) && !onlyParentVisible && <div className="flex flex-row justify-center">
                <BarChart width={700} height={250} data={artistsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="followers.total" fill="#8884d8" name='Followers'/>
                </BarChart>
            </div>}
            {resetVisible && (<div className='flex flex-row justify-center'>
                <Button onClick={handleReset}> Try a different interval </Button>
            </div>)}
        </div>
    )
}

export default GetTopStatsMonth;