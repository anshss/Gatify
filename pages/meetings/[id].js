/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/images/logo.png"

export default  function Profile() {


    const [ meetLink, setMeetLink ] = useState()
    
    const router = useRouter()
    const { id } = router.query;
    

    useEffect(()=> {
        generateMeetLink()
    }, [])

    const pageUrl = 'localhost:3000/meetings'

    function generateMeetLink() {
        setMeetLink(`${pageUrl}/${id}`)
    }

    const iframeConfig = {
        roomUrl: `https://iframe.huddle01.com/${id}`,
        height: "700px",
        width: "100%",
        noBorder: false, // false by default
      };
    
    return (
        <div className="pt-10 min-h-screen">
            <div className='flex gap-2 px-4 items-center mb-5 container mx-auto text-lg '>
                <Link className="router-link-active w-20 mr-6 router-link-exact-active mt-[-2px] flex transition-all duration-300 hover:opacity-60" href="/"> 
                    <Image src={Logo}/>
                </Link>
     
                <p>Meeting Link: </p>
                <button className="flex text-md" onClick={() => { navigator.clipboard.writeText(meetLink); toast("Text copied successfully") }}>{meetLink} &nbsp; <img className="hover:opacity-60" src="../copy.svg" /></button>
            </div>
            <ToastContainer />
            
            <HuddleIframe config={iframeConfig} />
        </div>
    )
}