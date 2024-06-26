'use client'; //being used in server component, need to specify client side for React hooks

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { getAuth, getToken, redirectToSpotifyAuth, testRedis } from '@/lib/utils';

const HomeLoginPage = () => {

    const [presentClicked, setPresentClicked] = useState(false);

    return(
        <main className="flex flex-col min-h-screen justify-between">
            <div className='flex flex-row justify-center'>
                <h1>Welcome to your monthly Wrapped ;)</h1>
            </div>
            {!presentClicked && 
            <div className='flex flex-row justify-center'>
                <button onClick={() => setPresentClicked(true)}> {/*have to add ()=> because onClick expects a function*/}
                    <Image src={'/pixel_gift_box_NOTPAIDSTOCKIMAGE.png'} alt={'wrapped_NOT_PAID'} width={200} height={200}></Image>
                </button>
            </div>}
            {presentClicked && 
            <div className='flex flex-col justify-center items-center'>
                <Button onClick={redirectToSpotifyAuth}>Log In to Spotify</Button>
            </div>}
            <div className='flex flex-row justify-center'>
                <a>by gabriel floreslovo (gabi)</a>
            </div>
        </main>
    )
}


export default HomeLoginPage;