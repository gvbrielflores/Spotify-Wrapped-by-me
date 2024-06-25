'use client'; //being used in server component, need to specify client side for React hooks

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getAuth, getToken } from '@/lib/utils';

const formSchema = z.object(
    {
        username: z.string(),
        password: z.string()
    }) 


const HomeLoginPage = () => {

    const [presentClicked, setPresentClicked] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                username: "",
                password: ""
            }
        }) 

    function onSubmit(values: z.infer<typeof formSchema>) {

    }

    return(
        <main className="flex flex-col min-h-screen justify-between">
            <div className='flex flex-row justify-center'>
                <h1>Welcome to your monthly Wrapped ;)</h1>
            </div>
            {!presentClicked && <div className='flex flex-row justify-center'>
                <button onClick={() => setPresentClicked(true)}> {/*have to add ()=> because onClick expects a function*/}
                    <Image src={'/pixel_gift_box_NOTPAIDSTOCKIMAGE.png'} alt={'wrapped_NOT_PAID'} width={200} height={200}></Image>
                </button>
            </div>}
            {presentClicked && 
            <div className='flex justify-between'>
                <button onClick={getAuth}>run getAuth</button>
                <button onClick={getToken}>run getToken</button>
            </div>
            // <div className='flex flex-col justify-center items-center'>
            //     <Form {...form}>
            //         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center">
            //             <FormField
            //                 control={form.control}
            //                 name="username"
            //                 render={({field}) => (
            //                     <FormItem>
            //                         <FormLabel> Username </FormLabel>
            //                         <FormControl>
            //                             <Input placeholder='Spotify username or email' {...field} />
            //                         </FormControl>
            //                         <FormMessage/>
            //                     </FormItem>
            //                 )}
            //             />  
            //             <FormField
            //                 control={form.control}
            //                 name="password"
            //                 render={({field}) => (
            //                     <FormItem>
            //                         <FormLabel> Password </FormLabel>
            //                         <FormControl>
            //                             <Input placeholder='Spotify account password' {...field} />
            //                         </FormControl>
            //                         <FormMessage/>
            //                     </FormItem>
            //                 )}
            //             />  
            //             <Button type="submit">Log In</Button>
            //         </form>
            //     </Form>    
            // </div>}
            }
            <div className='flex flex-row justify-center'>
                <a>by gabriel floreslovo (gabi)</a>
            </div>
        </main>
    )
}


export default HomeLoginPage;