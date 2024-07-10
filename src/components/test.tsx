'use client';

import { testRoute } from "@/lib/utils"
import { Button } from "./ui/button"

const TestButton = () => {
    return(
        <div>
            <Button onClick={testRoute}> test route </Button>
        </div>
    )
}

export default TestButton