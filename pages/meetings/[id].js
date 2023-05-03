/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <div className="pt-48 min-h-screen pb-20">
            <div className='flex gap-2'>
                <p>Meeting Link: </p>
                <button className="flex text-md mb-5" onClick={() => { navigator.clipboard.writeText(meetLink); toast("Text copied successfully") }}>{meetLink} &nbsp; <img className="hover:opacity-60" src="../copy.svg" /></button>
            </div>
            <ToastContainer />
            
            <HuddleIframe config={iframeConfig} />
        </div>
    )
}