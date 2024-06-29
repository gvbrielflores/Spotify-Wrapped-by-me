import GetTopStats from "@/components/get_top_stats";
import { Button } from "@/components/ui/button"
import { topTenArtistsOneMonth } from "@/lib/utils";

export default function Page() {
    return (
        <div>
            <GetTopStats/>
        </div>
    );
}