'use client'; //being used in server component, need to specify client side for React hooks

import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { redirectToSpotifyAuth } from '@/lib/utils';

const HomeLoginPage = () => {

    const [presentClicked, setPresentClicked] = useState(false);

    return(
        <main className="flex flex-col min-h-screen justify-between">
            <div className='flex flex-row justify-center'>
                <h1>Welcome to your monthly Wrapped ;)</h1>
            </div>
            {!presentClicked && 
            <div className='flex flex-row justify-center'>
                <button onClick={() => setPresentClicked(true)}> {/*have to add () => when passing args because onClick expects a function*/}
                    <Image src={'/pixel_gift_box_NOTPAIDSTOCKIMAGE.png'} alt={'wrapped_NOT_PAID'} width={200} height={200}></Image>
                </button>
            </div>}
            {presentClicked && 
            <div>
                <div className='flex flex-row justify-around items-center'>
                    <Button onClick={redirectToSpotifyAuth}>Log In to Spotify</Button>
                </div>
            </div>}
            <div className='flex flex-row justify-center'>
                <a>by gabriel floreslovo (gabi)</a>
            </div>
        </main>
    )
}


export default HomeLoginPage;