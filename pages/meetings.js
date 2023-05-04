import styles from "@/styles/Home.module.scss";
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { useState, useEffect } from "react";
import axios from "axios";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Meetings() {
  const [meetingDetails, setMeetingDetails] = useState({});
  const [myComm, setMyComm] = useState([]);
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    fetchMyComm();
  }, []);

  const router = useRouter();

  async function createMeeting(prop) {
    const response = await axios.post(
      "https://iriko.testing.huddle01.com/api/v1/create-room",
      {
        title: "Test Meeting",
        tokenType: "ERC1155",
        chain: "POLYGON",
        contractAddress: [`${prop.contractAddress}`],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_Huddle_Api,
        },
      }
    );

    console.log(response.data.data.roomId);
    router.push(`/meetings/${response.data.data.roomId}`);
  }

  async function fetchMyComm() {
    const modal = new web3modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const data1 = await contract.joinedComms();
    const items1 = await Promise.all(
      data1.map(async (i) => {
        let item = {
          id: i.id.toNumber(),
          logoLink: i.logoLink,
          name: i.name,
          host: i.creator,
          entryContract: i.entryContract,
          entryTokenId: i.entryTokenId.toNumber(),
          discordLink: i.discordLink,
        };
        return item;
      })
    );

    const data2 = await contract.hostedComms();
    const items2 = await Promise.all(
      data2.map(async (i) => {
        let item = {
          id: i.id.toNumber(),
          logoLink: i.logoLink,
          name: i.name,
          host: i.creator,
          entryContract: i.entryContract,
          entryTokenId: i.entryTokenId.toNumber(),
          discordLink: i.discordLink,
        };
        return item;
      })
    );

    const mergedArray = [...new Set([...items1, ...items2])];

    setMyComm(mergedArray);
    setLoaded(true);
  }

  function CommCard(prop) {
    return (
      <div className=" relative flex mt-10 w-2/3 mx-auto flex-row rounded-xl bg-gel-black text-sm overflow-hidden">
        <div className="flex mr-8 flex-col">
          <div className="rounded-t-3xl p-4 w-[230px] ">
            <img className="w-full aspect-square object-cover rounded-md" src={prop.logoLink} alt="" />
          </div>
          <div className="use-case-projects flex transition-all delay-100 duration-200 group-hover:translate-y-5 group-hover:scale-105 group-hover:opacity-0"></div>
        </div>
        <div className="flex-1  p-1 mt-4 text-[17px] items-start flex justify-center flex-col">
          <p className="mb-4 text-[25px] capitalize">{prop.name}</p>
          {/* <p>{prop.host}</p> */}
          <p className="mb-2">Requirements:</p>
          <div className="flex gap-2">
            <p>{prop.entryContract}</p>
            <p className="mb-6">#{prop.entryTokenId}</p>
          </div>
          <div className="flex gap-8 justify-between">
            
            <div className="flex justify-between">
              <button
                className="w-[300px] font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-black"
                onClick={() => createMeeting(prop)}
              >
                Launch Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  function debug() {
    console.log(myComm)
  }

  return (
    <div className="pt-40 pb-20">
        <p className="flex items-center justify-center">My Communities</p>
        <div className="mt-6">
          {myComm.map((item, i) => (
            <CommCard
              key={i}
              id={item.id}
              logoLink={item.logoLink}
              name={item.name}
              host={item.host}
              tokenId={item.tokenId}
              entryContract={item.entryContract}
              entryTokenId={item.entryTokenId}
              discordLink={item.discordLink}
            />
          ))}
        </div>
    </div>
  );
}
