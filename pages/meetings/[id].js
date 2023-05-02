/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";

export default  function Profile() {

    // const [ profile, setProfile ] = useState()
    
    const router = useRouter()
    const { id } = router.query;

    // useEffect(()=> {
    //     if (id) {
    //         fetchProfile()
    //     }
    // }, [id])

    // async function fetchProfile() {
    //     try {
    //         const response = await client.query(getProfileById, { id }).toPromise();
    //         setProfile(response.data.profiles.items[0])
    //         // console.log(response.data.profiles.items[0])

    //         const publicationData = await client.query(getProfile, { 
    //             request: {
    //                 id
    //             }
    //          }).toPromise();
    //          console.log( {publicationData})
             
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const iframeConfig = {
        roomUrl: `https://iframe.huddle01.com/${id}`,
        height: "600px",
        width: "80%",
        noBorder: false, // false by default
      };
    
    return (
        <div className="pt-40">
            <HuddleIframe config={iframeConfig} />
        </div>
    )
}