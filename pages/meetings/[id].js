/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";

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
        height: "600px",
        width: "100%",
        noBorder: false, // false by default
      };
    
    return (
        <div className="pt-40">
            <button className="flex text-md mb-5" onClick={() => { navigator.clipboard.writeText(meetLink) }}>{meetLink} &nbsp; <img src="../copy.svg" /></button>
            
            <HuddleIframe config={iframeConfig} />
        </div>
    )
}