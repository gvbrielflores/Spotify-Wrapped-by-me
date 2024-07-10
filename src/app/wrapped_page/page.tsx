import GetTopStats from "@/components/get_top_stats";
import TestButton from "@/components/test";
import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";

export default function Page() {
    return (
        <main className="flex-row min-h-screen items-center">
            <div className="flex items-center justify-around">
                <GetTopStats/>
            </div>
        </main>
    );
}