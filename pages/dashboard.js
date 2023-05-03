import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("renderJoinedComm");
  const [joinedComm, setJoinedComm] = useState([]);
  const [hostedComm, setHostedComm] = useState([]);

  const [loaded, setLoaded] = useState();

  const router = useRouter();

  // const [hostedComm, setHostedComm] = useState([{
  //     id: "1",
  //     logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
  //     name: "TestComm 1",
  //     host: "0x..",
  //     entryContract: "0x..",
  //     entryTokenId: "4",
  //     discordLink: "www.discord/...."
  // }, {
  //     id: "1",
  //     logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
  //     name: "TestComm 2",
  //     host: "0x..",
  //     entryContract: "0x..",
  //     entryTokenId: "28",
  //     discordLink: "www.discord/...."
  // }]);

  useEffect(() => {
    fetchHostedComm();
    fetchJoinedComm();
  }, []);

  async function fetchHostedComm() {
    const modal = new web3modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const data = await contract.hostedComms();
    const items = await Promise.all(
      data.map(async (i) => {
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
    setHostedComm(items);
    setLoaded(true);
  }

  async function fetchJoinedComm() {
    const modal = new web3modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const data = await contract.joinedComms();
    const items = await Promise.all(
      data.map(async (i) => {
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
    setJoinedComm(items);
    setLoaded(true);
  }

  function discord(prop) {
    router.push(`${prop.discordLink}`);
  }

  function CommCardJoined(prop) {
    return (
      <div className=" relative flex mt-10 w-2/3 mx-auto flex-row rounded-xl bg-gel-black text-sm overflow-hidden">
        <div className="flex mr-8 flex-col">
          <div className="rounded-t-3xl p-4 w-[230px] ">
            <img className="w-full" src={prop.logoLink} alt="" />
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
            {/* <Link href="/"> */}
            <div className="flex justify-between">
              <button
                className="w-[300px] font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-black"
                onClick={() => discord(prop)}
              >
                Join server
              </button>
            </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
    );
  }

  function CommCardHosted(prop) {
    return (
      <div className=" relative flex mt-10 w-2/3 mx-auto flex-row rounded-xl bg-gel-black text-sm overflow-hidden">
        <div className="flex mr-8 flex-col">
          <div className="rounded-t-3xl p-4 w-[230px] ">
            <img className="w-full" src={prop.logoLink} alt="" />
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
            {/* <Link href="/"> */}
            <div className="flex justify-between">
              <button
                className="w-[300px] font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-black"
                onClick={() => discord(prop)}
              >
                See server
              </button>
            </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
    );
  }

  function renderJoinedComm() {
    return (
      <div className={styles.joinedComm}>
        {/* <p>Joined Communities</p> */}
        <div>
          {joinedComm.map((item, i) => (
            <CommCardJoined
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

  function renderHostedComm() {
    return (
      <div className={styles.hostedComm}>
        {/* <p>Hosted Communities</p> */}
        <div>
          {hostedComm.map((item, i) => (
            <CommCardHosted
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

  return (
    <div className="mt-40">
      <div className="w-fullpx-2 py-10 pt-0 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1  max-w-md  rounded-2xl bg-[#202020] p-2">
            <Tab
              key={"Joined"}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                  "focus:outline-none",
                  selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
                )
              }
            >
              {"Joined"}
            </Tab>
            <Tab
              key={"Hosted"}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                  "focus:outline-none",
                  selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
                )
              }
            >
              {"Hosted"}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-8">
            <Tab.Panel
              key={0}
              className={classNames("rounded-xl bg-[#202020] p-3")}
            >
              {renderJoinedComm()}
            </Tab.Panel>
            <Tab.Panel
              key={1}
              className={classNames("rounded-xl bg-[#202020] p-3")}
            >
              {renderHostedComm()}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
