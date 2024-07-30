import GetTopStatsMonth from "@/components/get-top-stats-month";
import TestButton from "@/components/test";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Value } from "@radix-ui/react-select";
import WrappedPage from "@/components/wrapped-page";

export default function Page() {
    return (
        <main className="flex-row min-h-screen items-center content-center">
            <WrappedPage/>
        </main>
    );
}