'use client';

import GetTopStats from "@/components/get-top-stats";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "./ui/button";

/**
 * Component for selecting a time period and displaying relevant statistics
 * @component
 * @example
 *   <TimePeriodSelector prop1={sample_value1} prop2={sample_value2} />
 * @prop {Function} onValueChange - Handler function for when a time period is selected
 * @description
 *   - Uses a Select component to allow user to choose a time period
 *   - Displays different statistics based on the selected time period
 *   - Can be used in a dashboard or analytics page to compare data over different time periods
 *   - Supports time periods of one month, six months, and one year
 */
const WrappedPage = () => {
    const [choice, setChoice] = useState<String>('');
    const [visibleSelect, setVisibleSelect] = useState<Boolean>(true);

    const handleSelect = async () => {
        setVisibleSelect(!visibleSelect);
    }

    return (
        <div className="flex-col">
            {visibleSelect && (<div className="flex items-center justify-around p-2">
                <Select onValueChange={setChoice}> {/*Select component sends value as argument to handler specified here*/}
                    <SelectTrigger className="w-1/5">
                        <SelectValue placeholder='Peer into your soul for'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="short_term">One Month</SelectItem> {/*Using the spotify interval keywords as values*/}
                        <SelectItem value="medium_term">Six Months</SelectItem>
                        <SelectItem value="long_term">One Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>)}
            {choice === 'short_term' && (
            <div className="flex justify-around">
                <GetTopStats setParentVisible={handleSelect} interval={choice}/>
            </div>)}
            {choice === 'medium_term' && (
            <div className='flex justify-around'>
                <GetTopStats setParentVisible={handleSelect} interval={choice}/>
            </div>)}
            {choice === 'long_term' && (
            <div className='flex justify-around'>
                <GetTopStats setParentVisible={handleSelect} interval={choice}/>
            </div>)}
        </div>
    );
}

export default WrappedPage;