'use client';

import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";

const GetTopStats = () => {
    return (
        <div>
            <Button onClick={topTenArtistsOneMonth}> top ten artists for one month! </Button>
        </div>
    )
}

export default GetTopStats;