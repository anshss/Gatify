import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import SearchIcon from "../assets/images/search.png";
import Image from "next/image";

export default function Active() {
  const [fvmComm, setFvmComm] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredItems = fvmComm.filter((item) =>
    item.name.includes(searchQuery)
  );
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    fetchFvm();
  }, []);

  async function fetchFvm() {
    const modal = new web3modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const data = await contract.activeComms();
    const items = await Promise.all(
      data.map(async (i) => {
        let item = {
          id: i.id.toNumber(),
          logoLink: i.logoLink,
          name: i.name,
          host: i.creator,
          entryContract: i.entryContract,
          entryTokenId: i.entryTokenId.toNumber(),
        };
        return item;
      })
    );
    console.log(items);
    setFvmComm(items);
    setLoaded(true);
  }

  function CommCard(prop) {
    return (
      <div className=" relative flex  mt-10 w-3/4 mx-auto flex-row rounded-xl bg-gel-black text-sm overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="rounded-t-3xl p-4 ">
            <img className="w-[250px]" src={prop.logoLink} alt="" />
          </div>

          <div className="use-case-projects flex transition-all delay-100 duration-200 group-hover:translate-y-5 group-hover:scale-105 group-hover:opacity-0"></div>
        </div>
        <div className="flex-1  p-4 mt-4 text-[18px]">
          <div className="flex justify-between">
            <button
              className="font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-blue-600"
              onClick={() => buy(prop)}
            >
              Buy
            </button>
          </div>
          <p>{prop.id}</p>

          <p>{prop.name}</p>
          <p>{prop.host}</p>
          <p>{prop.entryContract}</p>
          <p>{prop.entryTokenId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.active}>
      <div className="bg w-screen h-screen fixed top-0 left-0 bg-no-repeat bg-cover -z-10 opacity-10"></div>
      <div className="container mx-auto pt-40">
        <div className="flex items-center flex-col justify-center ">
          <p className="text-center text-4xl">Search any Community</p>
          <div className="relative mt-6 mb-6">
            <Image src={SearchIcon} className="absolute top-4 left-4 w-4 h-4" />
            <input
              style={{ borderRadius: "8px" }}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="text-black w-[500px] p-3 px-4 pl-10 outline-none"
              name="searchBar"
              type="text"
              placeholder="Name a community"
            />
          </div>
        </div>

        <div>
          {filteredItems.map((item, i) => (
            <CommCard
              key={i}
              id={item.id}
              logoLink={item.logoLink}
              name={item.name}
              host={item.host}
              tokenId={item.tokenId}
              entryContract={item.entryContract}
              entryTokenId={item.entryTokenId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
